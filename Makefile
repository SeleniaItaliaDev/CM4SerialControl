# Paths
CLIENT_DIR=packages/ui-electron
RENDERER_DIR=$(CLIENT_DIR)/serialcontrol-ui
SERVER_DIR=packages/daemon

.PHONY: setup-all client-install server-install client-start server-start client-build

# ----- Setup -----
setup-all: client-install server-install

client-install:
	cd $(CLIENT_DIR) && npm install
	cd $(RENDERER_DIR) && npm install

server-install:
	cd $(SERVER_DIR) && npm install

# ----- Dev run (use two terminals) -----
client-start:
	cd $(CLIENT_DIR) && LIBGL_ALWAYS_SOFTWARE=1 NODE_ENV=development npm run start:dev

server-start:
	cd $(SERVER_DIR) && node src/index.js

# ----- Build UI for production -----
client-build:
	cd $(RENDERER_DIR) && npm run lint && npm run build

# ----- Run Client production build -----
client-prod-start:
	cd $(CLIENT_DIR) && npm run start:prod

# ----- Clean artifacts -----
clean:
	cd $(CLIENT_DIR) && make clean