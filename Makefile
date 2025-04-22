# Usage:
# make first-start   # installs Node.js
# make install       # installs npm deps
# make start         # runs Electron app

.PHONY: first-start install start clean

# Install Node.js (first-time setup)
first-start:
	curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
	sudo apt install -y nodejs

# Install project dependencies
install:
	npm install

# Run the app
start:
	npm start

# Clean up node_modules and lock files
clean:
	rm -rf node_modules package-lock.json