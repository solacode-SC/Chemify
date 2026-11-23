#!/usr/bin/env bash
# ==============================================================================
# Chemify — Multi-App Safe VPS Setup (Docker + Nginx + Let's Encrypt)
# Default Domain: chemify.solaymanbuilds.com
# Default Email:  elmouden00den@gmail.com
#
# Usage:
#   sudo bash scripts/setup-vps.sh [DOMAIN] [EMAIL]
# Or via Make:
#   sudo make vps-setup
#   sudo make vps-config
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
echo "  ║     CHEMIFY — MULTI-APP SAFE VPS DEPLOYMENT SYSTEM        ║"
echo "  ║     Domain: chemify.solaymanbuilds.com | Ports: 4326/5467 ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check for root / sudo privileges
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] This script must be run as root or with sudo.${NC}"
   exit 1
fi

# Parse positional arguments with production defaults
DOMAIN="${1:-chemify.solaymanbuilds.com}"
EMAIL="${2:-elmouden00den@gmail.com}"
PORT_PRIMARY="${PORT_PRIMARY:-4326}"
PORT_SECONDARY="${PORT_SECONDARY:-5467}"
PROJECT_NAME="${PROJECT_NAME:-chemify}"

# Named flag parsing support (--domain / --email / --port-primary / --port-secondary)
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
    --port-primary)
      PORT_PRIMARY="$2"
      shift 2
      ;;
    --port-secondary)
      PORT_SECONDARY="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

echo -e "\n${CYAN}==> Target Domain:      ${BOLD}${DOMAIN}${NC}"
echo -e "${CYAN}==> Let's Encrypt Email:${BOLD} ${EMAIL}${NC}"
echo -e "${CYAN}==> App Isolated Ports: ${BOLD}${PORT_PRIMARY} (Primary), ${PORT_SECONDARY} (Backup)${NC}"
echo -e "${CYAN}==> Docker Project:     ${BOLD}${PROJECT_NAME} (Multi-app isolated)${NC}\n"

# 1. Non-Destructive Package Check & Installation
echo -e "${GREEN}[1/6] Checking system packages (Multi-App Safe)...${NC}"

MISSING_PKGS=()
for cmd_pkg in "curl:curl" "git:git" "nginx:nginx" "certbot:certbot"; do
  cmd="${cmd_pkg%%:*}"
  pkg="${cmd_pkg##*:}"
  if ! command -v "$cmd" &>/dev/null; then
    MISSING_PKGS+=("$pkg")
  fi
done

if [[ ${#MISSING_PKGS[@]} -gt 0 ]]; then
  echo -e "${CYAN}Installing missing packages: ${MISSING_PKGS[*]}...${NC}"
  if command -v apt-get &>/dev/null; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y "${MISSING_PKGS[@]}" python3-certbot-nginx ca-certificates gnupg
  elif command -v dnf &>/dev/null; then
    dnf install -y "${MISSING_PKGS[@]}" python3-certbot-nginx
  elif command -v yum &>/dev/null; then
    yum install -y epel-release || true
    yum install -y "${MISSING_PKGS[@]}" python3-certbot-nginx
  fi
else
  echo -e "${GREEN}✓ Required host packages (curl, git, nginx, certbot) already present.${NC}"
fi

# 2. Verify Docker & Docker Compose without disrupting existing containers
echo -e "${GREEN}[2/6] Verifying Docker and Docker Compose installation...${NC}"
if ! command -v docker &>/dev/null; then
  echo -e "${CYAN}Installing Docker Engine via official get.docker.com script...${NC}"
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
else
  echo -e "${GREEN}✓ Docker is already installed ($(docker --version)).${NC}"
fi

systemctl start docker || true

# 3. Locate or Prepare Chemify Repository Directory & .env
echo -e "${GREEN}[3/6] Preparing project environment and checking port conflicts...${NC}"
PROJECT_DIR="$(pwd)"

if [[ ! -f "${PROJECT_DIR}/docker-compose.yml" || ! -f "${PROJECT_DIR}/Dockerfile" ]]; then
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

# Check if ports are occupied by another NON-Chemify application
for check_port in "$PORT_PRIMARY" "$PORT_SECONDARY"; do
  if ss -tulpn 2>/dev/null | grep -q ":${check_port} "; then
    if ! docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep "chemify" | grep -q ":${check_port}->"; then
      echo -e "${YELLOW}[NOTICE] Port ${check_port} is already bound on host. Checking owner...${NC}"
      ss -tulpn | grep ":${check_port} " || true
    fi
  fi
done

# Write / update .env file with configured values
cat <<EOF > "${PROJECT_DIR}/.env"
PROJECT_NAME=${PROJECT_NAME}
DOMAIN=${DOMAIN}
EMAIL=${EMAIL}
PORT_PRIMARY=${PORT_PRIMARY}
PORT_SECONDARY=${PORT_SECONDARY}
EOF
echo -e "${GREEN}✓ Updated .env for ${DOMAIN} (${EMAIL}).${NC}"

# 4. Build and Start Isolated Chemify Docker Container
echo -e "${GREEN}[4/6] Building and starting isolated '${PROJECT_NAME}' container on ports ${PORT_PRIMARY} & ${PORT_SECONDARY}...${NC}"
if docker compose version &>/dev/null; then
  docker compose -p "${PROJECT_NAME}" up -d --build --remove-orphans
elif command -v docker-compose &>/dev/null; then
  docker-compose -p "${PROJECT_NAME}" up -d --build --remove-orphans
else
  echo -e "${RED}[ERROR] Neither 'docker compose' nor 'docker-compose' found.${NC}"
  exit 1
fi

# Wait for container healthcheck
echo -e "${CYAN}Waiting for Chemify container healthcheck on port ${PORT_PRIMARY}...${NC}"
for i in {1..25}; do
  if curl -sf "http://127.0.0.1:${PORT_PRIMARY}/healthz" &>/dev/null || curl -sf "http://127.0.0.1:${PORT_SECONDARY}/healthz" &>/dev/null; then
    echo -e "${GREEN}✓ Container is healthy and responding!${NC}"
    break
  fi
  sleep 1
done

# 5. Multi-App Safe Host Nginx Virtual Host Configuration
echo -e "${GREEN}[5/6] Configuring Host Nginx virtual host for ${DOMAIN} (preserving all other apps)...${NC}"

NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

if [[ -d "$NGINX_CONF_DIR" && -d "$NGINX_ENABLED_DIR" ]]; then
  NGINX_CONF_PATH="${NGINX_CONF_DIR}/${DOMAIN}"
  # Remove old legacy 'chemify' symlink if it exists under a different filename to avoid duplicate upstream
  if [[ "$DOMAIN" != "chemify" && -L "${NGINX_ENABLED_DIR}/chemify" ]]; then
    rm -f "${NGINX_ENABLED_DIR}/chemify"
  fi
else
  NGINX_CONF_PATH="/etc/nginx/conf.d/${DOMAIN}.conf"
fi

if [[ -f "${PROJECT_DIR}/docker/nginx-host.conf.template" ]]; then
  sed -e "s/\${DOMAIN}/${DOMAIN}/g" \
      -e "s/\${PORT_PRIMARY}/${PORT_PRIMARY}/g" \
      -e "s/\${PORT_SECONDARY}/${PORT_SECONDARY}/g" \
      "${PROJECT_DIR}/docker/nginx-host.conf.template" > "$NGINX_CONF_PATH"
else
  cat <<EOF > "$NGINX_CONF_PATH"
upstream chemify_upstream {
    server 127.0.0.1:${PORT_PRIMARY} max_fails=3 fail_timeout=10s;
    server 127.0.0.1:${PORT_SECONDARY} backup;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 64M;

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log  /var/log/nginx/${DOMAIN}.error.log warn;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        proxy_pass http://chemify_upstream;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
fi

if [[ -d "$NGINX_ENABLED_DIR" ]]; then
  ln -sf "$NGINX_CONF_PATH" "${NGINX_ENABLED_DIR}/${DOMAIN}"
fi

# Validate Nginx syntax before reloading (zero downtime for other apps)
nginx -t
systemctl enable nginx || true
systemctl reload nginx
echo -e "${GREEN}✓ Host Nginx safely reloaded for ${DOMAIN} without disrupting existing sites.${NC}"

# 6. Let's Encrypt SSL Certificate Provisioning for ${DOMAIN}
echo -e "${GREEN}[6/6] Requesting Let's Encrypt SSL certificate for ${DOMAIN} (${EMAIL})...${NC}"

if certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect; then
  echo -e "${GREEN}✓ SSL certificate successfully installed and HTTPS redirect enabled!${NC}"
else
  echo -e "${YELLOW}[NOTICE] Certbot could not automatically issue certificate yet.${NC}"
  echo -e "${YELLOW}Ensure DNS A/AAAA record for ${DOMAIN} points to this server IP, then run:${NC}"
  echo -e "  sudo make ssl"
fi

if systemctl list-unit-files 2>/dev/null | grep -q certbot.timer; then
  systemctl enable --now certbot.timer || true
fi

# Final Summary
echo -e "\n${GREEN}${BOLD}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  ✓ CHEMIFY MULTI-APP VPS DEPLOYMENT COMPLETE!            ${NC}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════${NC}\n"
echo -e "  ${BOLD}Public HTTPS Domain:${NC}    ${CYAN}https://${DOMAIN}${NC}"
echo -e "  ${BOLD}SSL Admin Email:${NC}        ${CYAN}${EMAIL}${NC}"
echo -e "  ${BOLD}Isolated App Ports:${NC}     ${CYAN}127.0.0.1:${PORT_PRIMARY} & 127.0.0.1:${PORT_SECONDARY}${NC}"
echo -e "  ${BOLD}Local Healthcheck:${NC}      ${CYAN}http://127.0.0.1:${PORT_PRIMARY}/healthz${NC}"
echo -e "\n${BOLD}Useful Operations Commands:${NC}"
echo -e "  • Pull & update app:      ${CYAN}make update${NC}"
echo -e "  • Re-configure VPS/SSL:   ${CYAN}sudo make vps-config${NC}"
echo -e "  • View container logs:    ${CYAN}make logs${NC}"
echo -e "  • Check app status:       ${CYAN}make status${NC}\n"
