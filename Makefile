# Paths
CLIENT_DIR=packages/ui-electron
RENDERER_DIR=$(CLIENT_DIR)/serialcontrol-ui
SERVER_DIR=packages/daemon
NODE_REQUIRED := 22.9.0

# PHONY is used to declare targets that are not files to avoid conflicts.
.PHONY: setup-all client-install server-install clean client-build client-start-dev server-start client-start-prod

# ----- Environment / sanity checks -----
check-node:
	@if command -v node >/dev/null 2>&1; then \
	  CURR=$$(node -v | sed 's/^v//'); \
	  REQ=$(NODE_REQUIRED); \
	  if [ -f .nvmrc ]; then REQ=$$(cat .nvmrc); fi; \
	  if [ "$${CURR}" != "$${REQ}" ]; then \
	    echo "WARN: Node $$CURR != required $$REQ. If you use nvm: nvm use $${REQ}"; \
	  else \
	    echo "Node version OK ($$CURR)"; \
	  fi; \
	else \
	  echo "ERROR: node not found. Install Node (nvm or NodeSource)."; exit 1; \
	fi

# ----- Setup -----
setup-all: client-install server-install

client-install:
	cd $(CLIENT_DIR) && npm install
	cd $(RENDERER_DIR) && npm install

server-install:
	cd $(SERVER_DIR) && npm install

# ----- Clean artifacts -----
clean:
	cd $(CLIENT_DIR) && make clean

# ----- Build UI for production -----
client-build:
	cd $(RENDERER_DIR) && npm run lint && npm run build

# ----- Run Client in development mode -----
client-start-dev:
	cd $(CLIENT_DIR) && npm run start:dev

# ----- Run Server in development mode -----
server-start:
	cd $(SERVER_DIR) && node src/index.js

# ----- Run Client production build -----
client-start-prod: client-build
	cd $(CLIENT_DIR) && npm run start:prod

# ----- Pi bootstrap -----
setup-pi:
	@echo "== Raspberry Pi setup checklist =="
	@echo "1) Install build tools: sudo apt update && sudo apt install -y build-essential python3 make g++ pkg-config libudev-dev"
	@echo "2) Install Node (nvm or NodeSource). Example:"
	@echo "   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs"
	@echo "3) Serial access: sudo adduser $$USER dialout (then log out/in)"
	@echo "4) If using onboard UART: sudo raspi-config -> Interface Options -> Serial (login shell: No, hardware serial: Yes)"
	@echo "5) Then run: make setup-all && make run-both"
