# ==============================================================================
# Chemify — Production Deployment & Automation Makefile
# Target Domain: chemify.solaymanbuilds.com
# Production Ports: 4326 & 5467
# ==============================================================================

SHELL := /bin/bash
DOMAIN ?= chemify.solaymanbuilds.com
EMAIL ?= admin@solaymanbuilds.com
PORT_PRIMARY ?= 4326
PORT_SECONDARY ?= 5467
COMPOSE_FILE ?= docker-compose.yml

# Colors for terminal output
CYAN   := \033[0;36m
GREEN  := \033[0;32m
YELLOW := \033[1;33m
RED    := \033[0;31m
BOLD   := \033[1m
RESET  := \033[0m

.PHONY: help all build docker-build up down restart logs status deploy nginx-config ssl ssl-renew vps-setup clean

all: help

## ── Help & Documentation ──────────────────────────────────────────────────
help:
	@echo -e "\n$(CYAN)$(BOLD)Chemify — Automation & Deployment Commands$(RESET)"
	@echo -e "$(BOLD)Domain:$(RESET) $(GREEN)$(DOMAIN)$(RESET) | $(BOLD)Ports:$(RESET) $(GREEN)$(PORT_PRIMARY), $(PORT_SECONDARY)$(RESET)\n"
	@echo -e "  $(YELLOW)Production Docker Targets:$(RESET)"
	@echo -e "    $(CYAN)make docker-build$(RESET)     Build Docker image for production (Node 22 + Nginx Alpine)"
	@echo -e "    $(CYAN)make up$(RESET)               Start container in detached mode on ports $(PORT_PRIMARY) & $(PORT_SECONDARY)"
	@echo -e "    $(CYAN)make down$(RESET)             Stop and remove running containers"
	@echo -e "    $(CYAN)make restart$(RESET)          Restart production container"
	@echo -e "    $(CYAN)make logs$(RESET)             Follow container logs in real time"
	@echo -e "    $(CYAN)make status$(RESET)           Check container health and test port responses"
	@echo -e "    $(CYAN)make deploy$(RESET)           Full production deploy (build, start, verify ports)"
	@echo -e ""
	@echo -e "  $(YELLOW)Host Nginx & SSL Targets:$(RESET)"
	@echo -e "    $(CYAN)make nginx-config$(RESET)     Generate & apply host Nginx reverse proxy for $(DOMAIN)"
	@echo -e "    $(CYAN)make ssl$(RESET)              Issue and install Let's Encrypt SSL certificate via Certbot"
	@echo -e "    $(CYAN)make ssl-renew$(RESET)        Test Let's Encrypt certificate auto-renewal (dry-run)"
	@echo -e "    $(CYAN)make vps-setup$(RESET)        Run single-command automated VPS installation script"
	@echo -e ""
	@echo -e "  $(YELLOW)Local Development & Build Targets:$(RESET)"
	@echo -e "    $(CYAN)make build$(RESET)            Local production bundle build (tsc && vite build)"
	@echo -e "    $(CYAN)make clean$(RESET)            Remove build artifacts (dist/, logs)"
	@echo ""

## ── Local Development ─────────────────────────────────────────────────────
build:
	@echo -e "$(CYAN)==> Building local production bundle with TypeScript & Vite...$(RESET)"
	npm run build
	@echo -e "$(GREEN)✓ Local build complete in dist/$(RESET)"

clean:
	@echo -e "$(CYAN)==> Cleaning build artifacts...$(RESET)"
	rm -rf dist
	@echo -e "$(GREEN)✓ Clean complete.$(RESET)"

## ── Docker Production Management ──────────────────────────────────────────
docker-build:
	@echo -e "$(CYAN)==> Building production Docker image with multi-stage build...$(RESET)"
	docker compose build
	@echo -e "$(GREEN)✓ Docker image built successfully.$(RESET)"

up:
	@echo -e "$(CYAN)==> Starting Chemify production container on ports $(PORT_PRIMARY) & $(PORT_SECONDARY)...$(RESET)"
	docker compose up -d
	@echo -e "$(GREEN)✓ Container started.$(RESET)"
	@$(MAKE) status

down:
	@echo -e "$(CYAN)==> Stopping and removing Chemify container...$(RESET)"
	docker compose down
	@echo -e "$(GREEN)✓ Container stopped.$(RESET)"

restart:
	@echo -e "$(CYAN)==> Restarting Chemify container...$(RESET)"
	docker compose restart
	@$(MAKE) status

logs:
	docker compose logs -f

status:
	@echo -e "\n$(CYAN)==> Checking Chemify container status...$(RESET)"
	@docker compose ps
	@echo -e "\n$(CYAN)==> Testing HTTP probe on port $(PORT_PRIMARY)...$(RESET)"
	@curl -sf -o /dev/null -w "HTTP Response Code: %{http_code}\n" http://127.0.0.1:$(PORT_PRIMARY)/ || echo -e "$(RED)Port $(PORT_PRIMARY) not responding$(RESET)"
	@echo -e "$(CYAN)==> Testing HTTP probe on port $(PORT_SECONDARY)...$(RESET)"
	@curl -sf -o /dev/null -w "HTTP Response Code: %{http_code}\n" http://127.0.0.1:$(PORT_SECONDARY)/ || echo -e "$(RED)Port $(PORT_SECONDARY) not responding$(RESET)"
	@echo -e "$(CYAN)==> Testing Container Healthcheck endpoint (/healthz)...$(RESET)"
	@curl -sf http://127.0.0.1:$(PORT_PRIMARY)/healthz || echo -e "$(RED)Healthcheck probe failed$(RESET)"

deploy: docker-build up
	@echo -e "\n$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(RESET)"
	@echo -e "$(GREEN)$(BOLD)  ✓ Production deployment successful!                     $(RESET)"
	@echo -e "$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(RESET)"
	@echo -e "  Primary Port:   $(CYAN)http://localhost:$(PORT_PRIMARY)$(RESET)"
	@echo -e "  Secondary Port: $(CYAN)http://localhost:$(PORT_SECONDARY)$(RESET)\n"

## ── Host Nginx Reverse Proxy Configuration ────────────────────────────────
nginx-config:
	@echo -e "$(CYAN)==> Configuring host Nginx reverse proxy for $(DOMAIN)...$(RESET)"
	@if [ "$$(id -u)" -ne 0 ]; then \
		echo -e "$(RED)[ERROR] Please run with sudo: sudo make nginx-config$(RESET)"; \
		exit 1; \
	fi
	@mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
	@sed "s/\$${DOMAIN}/$(DOMAIN)/g" docker/nginx-host.conf.template > /etc/nginx/sites-available/$(DOMAIN)
	@ln -sf /etc/nginx/sites-available/$(DOMAIN) /etc/nginx/sites-enabled/$(DOMAIN)
	@rm -f /etc/nginx/sites-enabled/default
	@nginx -t
	@systemctl reload nginx
	@echo -e "$(GREEN)✓ Host Nginx configured and reloaded for $(DOMAIN)$(RESET)"

## ── Let's Encrypt SSL Certificate ─────────────────────────────────────────
ssl:
	@echo -e "$(CYAN)==> Requesting Let's Encrypt SSL certificate for $(DOMAIN)...$(RESET)"
	@if [ "$$(id -u)" -ne 0 ]; then \
		echo -e "$(RED)[ERROR] Please run with sudo: sudo make ssl$(RESET)"; \
		exit 1; \
	fi
	@certbot --nginx -d $(DOMAIN) --non-interactive --agree-tos -m $(EMAIL) --redirect
	@echo -e "$(GREEN)✓ SSL certificate active for https://$(DOMAIN)$(RESET)"

ssl-renew:
	@echo -e "$(CYAN)==> Testing Let's Encrypt certificate renewal dry-run...$(RESET)"
	@certbot renew --dry-run
	@echo -e "$(GREEN)✓ Certificate renewal test passed.$(RESET)"

## ── Full Turnkey VPS Automated Deployment ─────────────────────────────────
vps-setup:
	@echo -e "$(CYAN)==> Executing full turnkey VPS deployment script for $(DOMAIN)...$(RESET)"
	@if [ "$$(id -u)" -ne 0 ]; then \
		echo -e "$(RED)[ERROR] Please run with sudo: sudo make vps-setup$(RESET)"; \
		exit 1; \
	fi
	bash scripts/setup-vps.sh $(DOMAIN) $(EMAIL)

