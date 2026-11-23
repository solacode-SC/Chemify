# ==============================================================================
# Chemify — Multi-App Safe Production Deployment & Automation Makefile
# Target Domain: chemify.solaymanbuilds.com
# Admin Email:   elmouden00den@gmail.com
# Production Ports: 4326 (Primary) & 5467 (Secondary Failover)
# ==============================================================================

SHELL := /bin/bash
-include .env

PROJECT_NAME   ?= chemify
DOMAIN         ?= chemify.solaymanbuilds.com
EMAIL          ?= elmouden00den@gmail.com
PORT_PRIMARY   ?= 4326
PORT_SECONDARY ?= 5467
BRANCH         ?= main
COMPOSE_FILE   ?= docker-compose.yml
COMPOSE_CMD    := docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE)

# Colors for terminal output
CYAN   := \033[0;36m
GREEN  := \033[0;32m
YELLOW := \033[1;33m
RED    := \033[0;31m
BOLD   := \033[1m
RESET  := \033[0m

.PHONY: help all build clean env-setup check-ports docker-build up down restart \
        logs status health deploy update rollback prune nginx-config ssl ssl-renew \
        vps-config config vps-setup

all: help

## ── Help & Documentation ──────────────────────────────────────────────────
help:
	@echo -e "\n$(CYAN)$(BOLD)Chemify — Multi-App Safe VPS Automation & Deployment Commands$(RESET)"
	@echo -e "$(BOLD)Domain:$(RESET)  $(GREEN)$(DOMAIN)$(RESET)"
	@echo -e "$(BOLD)Email:$(RESET)   $(GREEN)$(EMAIL)$(RESET)"
	@echo -e "$(BOLD)Project:$(RESET) $(GREEN)$(PROJECT_NAME)$(RESET) | $(BOLD)Ports:$(RESET) $(GREEN)$(PORT_PRIMARY), $(PORT_SECONDARY)$(RESET)\n"
	@echo -e "  $(YELLOW)VPS Configuration & Multi-App Safe Setup:$(RESET)"
	@echo -e "    $(CYAN)sudo make vps-config$(RESET)  Configure VPS (.env, port check, Nginx vhost & SSL for $(DOMAIN))"
	@echo -e "    $(CYAN)sudo make vps-setup$(RESET)   Full turnkey VPS setup (Docker + Multi-App Nginx + SSL)"
	@echo -e "    $(CYAN)make env-setup$(RESET)        Generate/update .env with $(DOMAIN) & $(EMAIL)"
	@echo -e "    $(CYAN)make check-ports$(RESET)      Verify ports $(PORT_PRIMARY) & $(PORT_SECONDARY) have no conflict with other apps"
	@echo -e "    $(CYAN)sudo make nginx-config$(RESET) Generate & reload isolated Nginx vhost for $(DOMAIN) (preserves other apps)"
	@echo -e "    $(CYAN)sudo make ssl$(RESET)         Issue/update Let's Encrypt SSL cert for $(DOMAIN) ($(EMAIL))"
	@echo -e "    $(CYAN)sudo make ssl-renew$(RESET)   Test Let's Encrypt certificate auto-renewal (dry-run)"
	@echo -e ""
	@echo -e "  $(YELLOW)App Update & Lifecycle Management:$(RESET)"
	@echo -e "    $(CYAN)make update$(RESET)           Pull latest git changes, rebuild & update Chemify without downtime to other apps"
	@echo -e "    $(CYAN)make rollback$(RESET)         Roll back to previous git commit and redeploy container"
	@echo -e "    $(CYAN)make deploy$(RESET)           Build & start isolated Chemify production container"
	@echo -e "    $(CYAN)make docker-build$(RESET)     Build production Docker image (Node 22 + Nginx Alpine)"
	@echo -e "    $(CYAN)make up$(RESET)               Start Chemify container in detached mode on ports $(PORT_PRIMARY) & $(PORT_SECONDARY)"
	@echo -e "    $(CYAN)make down$(RESET)             Stop and remove only Chemify container & network"
	@echo -e "    $(CYAN)make restart$(RESET)          Restart Chemify container and verify health"
	@echo -e "    $(CYAN)make status$(RESET)           Check container status and probe ports $(PORT_PRIMARY) & $(PORT_SECONDARY)"
	@echo -e "    $(CYAN)make health$(RESET)           Verify local healthcheck & public HTTPS endpoint ($(DOMAIN))"
	@echo -e "    $(CYAN)make logs$(RESET)             Follow Chemify container logs in real time"
	@echo -e "    $(CYAN)make prune$(RESET)            Clean up unused dangling Docker build images"
	@echo -e ""
	@echo -e "  $(YELLOW)Local Development & Build Targets:$(RESET)"
	@echo -e "    $(CYAN)make build$(RESET)            Local production bundle build (tsc && vite build)"
	@echo -e "    $(CYAN)make clean$(RESET)            Remove local build artifacts (dist/)"
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

## ── Environment & Multi-App Conflict Checks ───────────────────────────────
env-setup:
	@echo -e "$(CYAN)==> Writing production .env configuration for $(DOMAIN) ($(EMAIL))...$(RESET)"
	@printf "PROJECT_NAME=%s\nDOMAIN=%s\nEMAIL=%s\nPORT_PRIMARY=%s\nPORT_SECONDARY=%s\n" \
		"$(PROJECT_NAME)" "$(DOMAIN)" "$(EMAIL)" "$(PORT_PRIMARY)" "$(PORT_SECONDARY)" > .env
	@echo -e "$(GREEN)✓ .env configured: DOMAIN=$(DOMAIN) | EMAIL=$(EMAIL) | PORTS=$(PORT_PRIMARY),$(PORT_SECONDARY)$(RESET)"

check-ports:
	@echo -e "$(CYAN)==> Checking ports $(PORT_PRIMARY) and $(PORT_SECONDARY) for multi-app conflicts...$(RESET)"
	@CONFLICT=0; \
	for PORT in $(PORT_PRIMARY) $(PORT_SECONDARY); do \
		if command -v ss >/dev/null 2>&1 && ss -tulpn 2>/dev/null | grep -q ":$$PORT "; then \
			if docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep "chemify" | grep -q ":$$PORT->"; then \
				echo -e "$(GREEN)  ✓ Port $$PORT is active and owned by Chemify container.$(RESET)"; \
			else \
				echo -e "$(YELLOW)  ! Warning: Port $$PORT is currently bound by another process:$(RESET)"; \
				ss -tulpn 2>/dev/null | grep ":$$PORT " || true; \
				CONFLICT=1; \
			fi; \
		else \
			echo -e "$(GREEN)  ✓ Port $$PORT is free and available.$(RESET)"; \
		fi; \
	done; \
	if [ "$$CONFLICT" -eq 1 ]; then \
		echo -e "$(YELLOW)  Tip: Override ports anytime via: make deploy PORT_PRIMARY=4328 PORT_SECONDARY=5468$(RESET)"; \
	fi

## ── Docker Production Management (Isolated by PROJECT_NAME) ───────────────
docker-build:
	@echo -e "$(CYAN)==> Building isolated production Docker image for project '$(PROJECT_NAME)'...$(RESET)"
	$(COMPOSE_CMD) build
	@echo -e "$(GREEN)✓ Docker image built successfully.$(RESET)"

up:
	@echo -e "$(CYAN)==> Starting isolated Chemify container on ports $(PORT_PRIMARY) & $(PORT_SECONDARY)...$(RESET)"
	$(COMPOSE_CMD) up -d --remove-orphans
	@echo -e "$(GREEN)✓ Container started.$(RESET)"
	@$(MAKE) status

down:
	@echo -e "$(CYAN)==> Stopping and removing isolated Chemify container (other VPS apps untouched)...$(RESET)"
	$(COMPOSE_CMD) down
	@echo -e "$(GREEN)✓ Chemify container stopped.$(RESET)"

restart:
	@echo -e "$(CYAN)==> Restarting Chemify container...$(RESET)"
	$(COMPOSE_CMD) restart
	@$(MAKE) status

logs:
	$(COMPOSE_CMD) logs -f

status:
	@echo -e "\n$(CYAN)==> Checking Chemify container status (project: $(PROJECT_NAME))...$(RESET)"
	@$(COMPOSE_CMD) ps
	@echo -e "\n$(CYAN)==> Testing HTTP probe on primary port $(PORT_PRIMARY)...$(RESET)"
	@curl -sf -o /dev/null -w "HTTP Response Code: %{http_code}\n" http://127.0.0.1:$(PORT_PRIMARY)/ || echo -e "$(RED)Port $(PORT_PRIMARY) not responding$(RESET)"
	@echo -e "$(CYAN)==> Testing HTTP probe on secondary port $(PORT_SECONDARY)...$(RESET)"
	@curl -sf -o /dev/null -w "HTTP Response Code: %{http_code}\n" http://127.0.0.1:$(PORT_SECONDARY)/ || echo -e "$(RED)Port $(PORT_SECONDARY) not responding$(RESET)"
	@echo -e "$(CYAN)==> Testing Container Healthcheck endpoint (/healthz)...$(RESET)"
	@curl -sf http://127.0.0.1:$(PORT_PRIMARY)/healthz || echo -e "$(RED)Healthcheck probe failed$(RESET)"

health: status
	@echo -e "\n$(CYAN)==> Probing public domain https://$(DOMAIN)...$(RESET)"
	@curl -skL -o /dev/null -w "Public Domain Response: HTTP %{http_code} (%{url_effective})\n" https://$(DOMAIN) || echo -e "$(YELLOW)Public HTTPS endpoint not reachable yet (check DNS / SSL)$(RESET)"

deploy: env-setup check-ports docker-build up
	@echo -e "\n$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(RESET)"
	@echo -e "$(GREEN)$(BOLD)  ✓ Production deployment successful!                     $(RESET)"
	@echo -e "$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(RESET)"
	@echo -e "  Domain:         $(CYAN)https://$(DOMAIN)$(RESET)"
	@echo -e "  Primary Port:   $(CYAN)http://127.0.0.1:$(PORT_PRIMARY)$(RESET)"
	@echo -e "  Secondary Port: $(CYAN)http://127.0.0.1:$(PORT_SECONDARY)$(RESET)\n"

## ── App Update & Rollback Commands ────────────────────────────────────────
update:
	@echo -e "\n$(CYAN)$(BOLD)==> Updating Chemify Application ($(DOMAIN))...$(RESET)"
	@echo -e "$(CYAN)[1/4] Fetching and pulling latest changes from git...$(RESET)"
	@git fetch --all --prune
	@CURRENT_BRANCH=$$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "$(BRANCH)"); \
	echo -e "$(CYAN)Pulling latest commits on branch '$$CURRENT_BRANCH'...$(RESET)"; \
	git pull --ff-only origin "$$CURRENT_BRANCH" || git pull origin "$$CURRENT_BRANCH"
	@echo -e "$(CYAN)[2/4] Rebuilding and recreating Chemify container (zero conflict with other apps)...$(RESET)"
	$(COMPOSE_CMD) up -d --build --remove-orphans
	@echo -e "$(CYAN)[3/4] Cleaning up old dangling Docker images...$(RESET)"
	@docker image prune -f >/dev/null 2>&1 || true
	@echo -e "$(CYAN)[4/4] Verifying updated container health...$(RESET)"
	@$(MAKE) status
	@echo -e "\n$(GREEN)$(BOLD)✓ Chemify successfully updated to the latest version ($(shell git rev-parse --short HEAD 2>/dev/null))!$(RESET)\n"

rollback:
	@echo -e "$(YELLOW)==> Rolling back Chemify to the previous git commit...$(RESET)"
	@git reset --hard HEAD~1
	$(COMPOSE_CMD) up -d --build --remove-orphans
	@$(MAKE) status
	@echo -e "$(GREEN)✓ Rollback complete (now at commit $(shell git rev-parse --short HEAD 2>/dev/null)).$(RESET)"

prune:
	@echo -e "$(CYAN)==> Pruning dangling Docker images...$(RESET)"
	@docker image prune -f
	@echo -e "$(GREEN)✓ Dangling images cleaned.$(RESET)"

## ── Multi-App Safe Host Nginx & SSL Configuration ─────────────────────────
nginx-config:
	@echo -e "$(CYAN)==> Configuring isolated host Nginx virtual host for $(DOMAIN)...$(RESET)"
	@if [ "$$(id -u)" -ne 0 ]; then \
		echo -e "$(RED)[ERROR] Please run with sudo: sudo make nginx-config$(RESET)"; \
		exit 1; \
	fi
	@mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
	@sed -e "s/\$${DOMAIN}/$(DOMAIN)/g" \
	     -e "s/\$${PORT_PRIMARY}/$(PORT_PRIMARY)/g" \
	     -e "s/\$${PORT_SECONDARY}/$(PORT_SECONDARY)/g" \
	     docker/nginx-host.conf.template > /etc/nginx/sites-available/$(DOMAIN)
	@ln -sf /etc/nginx/sites-available/$(DOMAIN) /etc/nginx/sites-enabled/$(DOMAIN)
	@if [ "$(DOMAIN)" != "chemify" ] && [ -L /etc/nginx/sites-enabled/chemify ]; then \
		rm -f /etc/nginx/sites-enabled/chemify; \
	fi
	@nginx -t
	@systemctl reload nginx
	@echo -e "$(GREEN)✓ Host Nginx safely configured and reloaded for $(DOMAIN) (all other VPS apps preserved).$(RESET)"

ssl:
	@echo -e "$(CYAN)==> Requesting Let's Encrypt SSL certificate for $(DOMAIN) (Email: $(EMAIL))...$(RESET)"
	@if [ "$$(id -u)" -ne 0 ]; then \
		echo -e "$(RED)[ERROR] Please run with sudo: sudo make ssl$(RESET)"; \
		exit 1; \
	fi
	@certbot --nginx -d $(DOMAIN) --non-interactive --agree-tos -m $(EMAIL) --redirect
	@echo -e "$(GREEN)✓ SSL certificate active for https://$(DOMAIN) (renewal alerts -> $(EMAIL))$(RESET)"

ssl-renew:
	@echo -e "$(CYAN)==> Testing Let's Encrypt certificate renewal dry-run...$(RESET)"
	@certbot renew --dry-run
	@echo -e "$(GREEN)✓ Certificate renewal test passed.$(RESET)"

## ── Turnkey VPS Configuration & Full Setup Commands ───────────────────────
vps-config: env-setup check-ports deploy nginx-config ssl
	@echo -e "\n$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(RESET)"
	@echo -e "$(GREEN)$(BOLD)  ✓ VPS Configuration Complete for $(DOMAIN)!$(RESET)"
	@echo -e "$(GREEN)$(BOLD)  ✓ SSL Email: $(EMAIL) | Ports: $(PORT_PRIMARY), $(PORT_SECONDARY)$(RESET)"
	@echo -e "$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(RESET)\n"

config: vps-config

vps-setup:
	@echo -e "$(CYAN)==> Executing multi-app safe VPS deployment script for $(DOMAIN) ($(EMAIL))...$(RESET)"
	@if [ "$$(id -u)" -ne 0 ]; then \
		echo -e "$(RED)[ERROR] Please run with sudo: sudo make vps-setup$(RESET)"; \
		exit 1; \
	fi
	bash scripts/setup-vps.sh $(DOMAIN) $(EMAIL)
