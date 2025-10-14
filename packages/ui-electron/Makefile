# Run React (Vite) dev server
react-dev:
	cd serialcontrol-ui && npm run dev

# Run Electron with development environment
electron-dev:
	NODE_ENV=development electron main.js

# Run both React and Electron for live development (concurrently)
dev:
	NODE_ENV=development npx concurrently "npm run dev --prefix serialcontrol-ui" "npm run electron"

# Build React app for production
react-build:
	cd serialcontrol-ui && npm run build

# Package Electron app (example, adjust as needed!)
electron-build:
	NODE_ENV=production electron-builder

# Clean build artifacts
clean:
	rm -rf serialcontrol-ui/dist