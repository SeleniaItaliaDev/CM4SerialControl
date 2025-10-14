# CM4 Control — Monorepo

<p><strong>Goal: </strong>Reliable control of an RS-485 board from a Raspberry Pi CM4.</p>
<p><strong>Design: </strong>Split into a Node daemon (owns the serial bus) and a UI app (Electron/React) that talks to the daemon via WebSocket.</p>

<h4>Why this split?</h4>

<p>Stability: serialport in plain Node avoids Electron ABI rebuild hell on ARM.</p>
<p>Resilience: Daemon runs as a systemd service (auto-start, auto-restart, logs).</p>
<p>Independence: UI and daemon can be built, deployed, and updated separately.</p>

<h3>What’s inside</h3>
<code>
cm4-control/
├─ package.json                 # npm workspaces
├─ Makefile                     # handy top-level commands
├─ README.md                    # (this file)
├─ ops/
│  ├─ cm4-serial.service        # systemd unit (daemon)
│  └─ install-daemon.sh         # optional helper
└─ packages/
   ├─ daemon/                   # Node + serialport + WS server
   │  ├─ src/
   │  │  ├─ index.js            # TX loop (100ms), RX parser, WS API
   │  │  ├─ packet.js           # frame builder (FF 00 00 00 03 …)
   │  │  └─ buffers/            # perif2/3/10/11 state → payload
   │  └─ README.md
   └─ ui-electron/              # Electron (kiosk) UI, talks WS -> localhost:8081
      ├─ main.js                # fullscreen/kiosk window
      ├─ preload.js             # (optional) IPC bridge
      ├─ public/index.html      # simple UI (or React/Vite later)
      └─ README.md
</code>
</hr>

<h3>Protocol (1-liner)</h3>
<p><code> FF 00 00 00 03 | DEST | LEN | PAYLOAD | CHECKSUM</code>, where:</p>
<p><code> CHECKSUM = (256 - ((DEST + LEN + sum(PAYLOAD)) % 256)) % 256. </code></p>

Daemon sends perif 2/3/10/11 buffers every 100 ms; parses replies; exposes minimal WS API.

</hr>

# Quick start (dev)
<p>Clone + install</p>
<code>npm i</code>
<p>Run daemon (serial + ws://localhost:8081)</p>
<code>npm run dev:daemon</code>
<p>Run UI (Electron)</p>
<code>npm run dev:ui</code>

<h3>Makefile (top-level)</h3>
<code>
dev-daemon:        # run daemon locally
	@npm --workspace packages/daemon run dev

dev-ui:            # run electron UI
	@npm --workspace packages/ui-electron start

build-ui:          # package electron app
	@npm --workspace packages/ui-electron run dist
</code>
</hr>

# Deploy daemon as a service (Pi CM4)
<p><strong>Prerequisites:</strong></p>
<code>
sudo apt-get update
sudo apt-get install -y build-essential python3 make
sudo usermod -aG dialout,tty pi  # serial device access (logout/reboot after)
</code>

<p><strong>Install files (adjust path if needed)</strong></p>
<code>
sudo cp ops/cm4-serial.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cm4-serial.service   # autostart on boot
sudo systemctl start cm4-serial.service
journalctl -u cm4-serial.service -f        # follow logs
</code>

<p><strong>Edit the unit to match your path:</strong></p>
<code>
[Service]
WorkingDirectory=/opt/cm4-control/packages/daemon
ExecStart=/usr/bin/node /opt/cm4-control/packages/daemon/src/index.js
</code>

# UI on the Pi:

- Electron window in kiosk mode (kiosk: true, autoHideMenuBar: true, hide cursor via CSS).
- UI talks to daemon at ws://localhost:8081.
- No native modules in UI.

Build on the Pi (simplest for ARM) via:
<code>npm run build:ui</code>

# WS contract (minimal)

UI → Daemon:
<code>
{ "cmd": "setLed", "peripheral": 10, "value": 7 }
{ "cmd": "readSerial", "peripheral": 10 }
</code>

Daemon → UI:
<code>
{ "event": "telemetry", "peripheral": 2, "payload": [ ... ] }
{ "event": "ack", "cmd": "setLed", "ok": true }
{ "event": "error", "message": "..." }
</code>

Guardrails:
- Node LTS 20.x, serialport in daemon only.
- UART path configurable (/dev/ttyAMA2 default).
- Always TX 2/3/10/11 every 100 ms (state-driven payloads).
- Use port.drain() after writes when timing matters.
- WS bound to localhost; no remote exposure.
- Electron 24–28 recommended on CM4; no serialport there.