# Path shortcuts
CLIENT_DIR=packages/ui-electron
SERVER_DIR=packages/daemon

# ----- Electron & native dependencies (for Pi) -----
.PHONY: client-install-pi
client-install-pi:
	cd $(CLIENT_DIR) && npm install electron --arch=armv7l --platform=linux
	cd $(CLIENT_DIR) && npm install
	cd $(CLIENT_DIR) && npx electron-rebuild

# ----- Client commands -----

.PHONY: client-install
client-install:
	cd $(CLIENT_DIR) && npm install

.PHONY: client-start
client-start:
	cd $(CLIENT_DIR) && LIBGL_ALWAYS_SOFTWARE=1 npm start


.PHONY: client-rebuild
client-rebuild:
	cd $(CLIENT_DIR) && npx electron-rebuild

# ----- Server commands -----

.PHONY: server-install
server-install:
	cd $(SERVER_DIR) && npm install

.PHONY: server-start
server-start:
	cd $(SERVER_DIR) && node src/index.js

# ----- Full setup -----

.PHONY: setup-all
setup-all: client-install server-install

.PHONY: start-all
start-all: client-start server-start