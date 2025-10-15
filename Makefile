# Paths
CLIENT_DIR=packages/ui-electron
RENDERER_DIR=$(CLIENT_DIR)/serialcontrol-ui
SERVER_DIR=packages/daemon

# PHONY is used to declare targets that are not files to avoid conflicts.
.PHONY: setup-all client-install server-install clean client-build client-start-dev server-start client-start-prod

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
client-start-prod:
	cd $(CLIENT_DIR) && npm run start:prod

