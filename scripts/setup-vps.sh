#!/usr/bin/env bash
# ==============================================================================
# Chemify — Automated Single-Command VPS Setup (Docker + Nginx + Let's Encrypt)
#
# Usage:
#   sudo bash scripts/setup-vps.sh <DOMAIN> <EMAIL>
# Or via curl:
#   curl -fsSL https://raw.githubusercontent.com/solacode-SC/Chemify/main/scripts/setup-vps.sh | sudo bash -s -- <DOMAIN> <EMAIL>
# ==============================================================================

set -euo pipefail

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
CYAN="\033[0;36m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

echo -e "${CYAN}${BOLD}"
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║         CHEMIFY — PRODUCTION VPS DEPLOYMENT SYSTEM        ║"
echo "  ║         Docker Ports: 4326 & 5467  |  Nginx + SSL         ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check for root / sudo privileges
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] This script must be run as root or with sudo.${NC}"
   exit 1
fi

# Parse Arguments (defaults to chemify.solaymanbuilds.com)
DOMAIN="${1:-chemify.solaymanbuilds.com}"
EMAIL="${2:-admin@solaymanbuilds.com}"

# Named flag parsing support (--domain / --email)
while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain|-d)
      DOMAIN="$2"
      shift 2
      ;;
    --email|-e)
      EMAIL="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

# Interactive Prompts if arguments missing
if [[ -z "$DOMAIN" ]]; then
  echo -e "${YELLOW}Please enter your production domain name (e.g., chemify.example.com):${NC}"
  read -r -p "Domain: " DOMAIN
fi

if [[ -z "$DOMAIN" ]]; then
  echo -e "${RED}[ERROR] Domain name is required for Nginx and SSL setup.${NC}"
  exit 1
fi

if [[ -z "$EMAIL" ]]; then
  echo -e "${YELLOW}Please enter an administrator email address for Let's Encrypt alerts:${NC}"
  read -r -p "Email: " EMAIL
fi

if [[ -z "$EMAIL" ]]; then
  EMAIL="admin@${DOMAIN}"
  echo -e "${YELLOW}[INFO] Using default email: ${EMAIL}${NC}"
fi

echo -e "\n${CYAN}==> Target Domain: ${BOLD}${DOMAIN}${NC}"
echo -e "${CYAN}==> Let's Encrypt Email: ${BOLD}${EMAIL}${NC}\n"

# 1. Package Manager Detection & Dependency Installation
echo -e "${GREEN}[1/6] Detecting OS package manager and installing dependencies...${NC}"

if command -v apt-get &>/dev/null; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y curl git ufw ca-certificates gnupg lsb-release nginx certbot python3-certbot-nginx
elif command -v dnf &>/dev/null; then
  dnf install -y curl git nginx certbot python3-certbot-nginx
elif command -v yum &>/dev/null; then
  yum install -y epel-release || true
  yum install -y curl git nginx certbot python3-certbot-nginx
else
  echo -e "${YELLOW}[WARN] Unknown package manager. Ensure nginx, certbot, and docker are installed.${NC}"
fi

# 2. Install Docker & Docker Compose if missing
echo -e "${GREEN}[2/6] Verifying Docker and Docker Compose installation...${NC}"
if ! command -v docker &>/dev/null; then
  echo -e "${CYAN}Installing Docker Engine via official get.docker.com script...${NC}"
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
else
  echo -e "${CYAN}Docker is already installed ($(docker --version)).${NC}"
fi

# Ensure Docker service is running
systemctl enable --now docker

# 3. Locate or Prepare Chemify Repository Directory
echo -e "${GREEN}[3/6] Preparing project files and build context...${NC}"
PROJECT_DIR="$(pwd)"

if [[ ! -f "${PROJECT_DIR}/docker-compose.yml" || ! -f "${PROJECT_DIR}/Dockerfile" ]]; then
  # If executed remotely via curl outside repo directory
  if [[ -d "/var/www/chemify" ]]; then
    cd /var/www/chemify
    PROJECT_DIR="/var/www/chemify"
  else
    echo -e "${CYAN}Cloning Chemify repository to /var/www/chemify...${NC}"
    mkdir -p /var/www
    git clone https://github.com/solacode-SC/Chemify.git /var/www/chemify
    cd /var/www/chemify
    PROJECT_DIR="/var/www/chemify"
  fi
fi

# Ensure .env is present
if [[ ! -f "${PROJECT_DIR}/.env" && -f "${PROJECT_DIR}/.env.example" ]]; then
  cp "${PROJECT_DIR}/.env.example" "${PROJECT_DIR}/.env"
fi

# 4. Build and Start Docker Containers on Ports 4326 & 5467
echo -e "${GREEN}[4/6] Building and starting Chemify Docker container on ports 4326 & 5467...${NC}"
if docker compose version &>/dev/null; then
  docker compose down --remove-orphans || true
  docker compose up -d --build
elif command -v docker-compose &>/dev/null; then
  docker-compose down --remove-orphans || true
  docker-compose up -d --build
else
  echo -e "${RED}[ERROR] Neither 'docker compose' nor 'docker-compose' found.${NC}"
  exit 1
fi

# Wait for container healthcheck
echo -e "${CYAN}Waiting for Chemify container healthcheck on port 4326...${NC}"
for i in {1..20}; do
  if curl -sf http://127.0.0.1:4326/healthz &>/dev/null || curl -sf http://127.0.0.1:5467/healthz &>/dev/null; then
    echo -e "${GREEN}✓ Container is healthy and responding!${NC}"
    break
  fi
  sleep 1
done

# 5. Configure Host Nginx Reverse Proxy
echo -e "${GREEN}[5/6] Configuring Host Nginx reverse proxy for ${DOMAIN}...${NC}"

NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

if [[ ! -d "$NGINX_CONF_DIR" ]]; then
  # CentOS / RHEL style
  NGINX_CONF_PATH="/etc/nginx/conf.d/chemify.conf"
else
  NGINX_CONF_PATH="${NGINX_CONF_DIR}/chemify"
fi

cat <<EOF > "$NGINX_CONF_PATH"
# Chemify Reverse Proxy with dual container fallback
upstream chemify_upstream {
    server 127.0.0.1:4326 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:5467 backup;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 64M;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        proxy_pass http://chemify_upstream;
        proxy_http_version 1.1;

        # Header forwarding
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Enable site if Debian/Ubuntu
if [[ -d "$NGINX_ENABLED_DIR" ]]; then
  ln -sf "$NGINX_CONF_PATH" "${NGINX_ENABLED_DIR}/chemify"
  # Remove default site if present
  rm -f "${NGINX_ENABLED_DIR}/default"
fi

# Test Nginx syntax
nginx -t
systemctl enable nginx
systemctl reload nginx

# 6. Automate Let's Encrypt SSL Certificate Generation
echo -e "${GREEN}[6/6] Requesting Let's Encrypt SSL certificate for ${DOMAIN}...${NC}"

if certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect; then
  echo -e "${GREEN}✓ SSL certificate successfully installed and HTTPS redirect enabled!${NC}"
else
  echo -e "${YELLOW}[NOTICE] Certbot could not automatically issue certificate.${NC}"
  echo -e "${YELLOW}Common reason: DNS records for ${DOMAIN} may not be pointed to this server IP yet.${NC}"
  echo -e "${YELLOW}You can re-run SSL provisioning anytime with:${NC}"
  echo -e "  sudo certbot --nginx -d ${DOMAIN} -m ${EMAIL} --agree-tos"
fi

# Enable Certbot auto-renewal timer
if systemctl list-unit-files | grep -q certbot.timer; then
  systemctl enable --now certbot.timer
fi

# UFW Firewall adjustment if active
if command -v ufw &>/dev/null && ufw status | grep -q "Status: active"; then
  echo -e "${CYAN}Adjusting UFW firewall rules...${NC}"
  ufw allow 'Nginx Full' || true
  ufw allow 4326/tcp || true
  ufw allow 5467/tcp || true
fi

# Final Summary
echo -e "\n${GREEN}${BOLD}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  ✓ CHEMIFY IS SUCCESSFULLY DEPLOYED AND RUNNING!         ${NC}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════${NC}\n"
echo -e "  ${BOLD}Public HTTPS Domain:${NC}    ${CYAN}https://${DOMAIN}${NC}"
echo -e "  ${BOLD}Direct Container Port 1:${NC} ${CYAN}http://${DOMAIN}:4326${NC}"
echo -e "  ${BOLD}Direct Container Port 2:${NC} ${CYAN}http://${DOMAIN}:5467${NC}"
echo -e "  ${BOLD}Local Healthcheck:${NC}       ${CYAN}http://127.0.0.1:4326/healthz${NC}"
echo -e "\n${BOLD}Useful Operations Commands:${NC}"
echo -e "  • View container logs:    ${CYAN}docker compose logs -f${NC}"
echo -e "  • Restart application:    ${CYAN}docker compose restart${NC}"
echo -e "  • Test SSL auto-renewal:  ${CYAN}sudo certbot renew --dry-run${NC}"
echo -e "  • Check Nginx status:     ${CYAN}sudo systemctl status nginx${NC}\n"

