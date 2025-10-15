# CM4 Serial Control — Monorepo

<p><strong>Goal: </strong>Reliable control of an RS-485 board from a Raspberry Pi CM4.</p>
<p><strong>Design: </strong>Split into a Node daemon (owns the serial bus) and a UI app (Electron/React) that talks to the daemon via WebSocket.</p>

<h3>What’s inside</h3>
<p>Inside the project monorepo we have:</p>

- packages folder -> contains the client and the server needed for the whole app to function.
   - daemon -> contains the node daemon server, responsible for the communication with the RS485 board
   - ui-electron -> top level of the UI. It runs the client app with electron
      - serialcontrol-ui -> Actual React+Vite client application. Can run on it's own for dev purposes.
   - ops -> systemd unit (daemon)
      - cm4-serial-control.service -> runs the Node server as a Daemon on the Raspberry Pi.

</hr>

So, client React+Vite is in serialcontrol-ui. We build and serve the client via Electron in ui-electron, and the client communicates with the Node daemon via WebSocket. 

<h4>Why this split?</h4>
<p>Stability: serialport in plain Node avoids Electron ABI rebuild hell on ARM.</p>
<p>Resilience: Daemon runs as a systemd service (auto-start, auto-restart, logs).</p>
<p>Independence: UI and daemon can be built, deployed, and updated separately.</p>
</hr>

# Quick start (dev)
<p>
   <p>Clone + install</p>
   <code>make setup-all</code>
</p>
<p>
   <p>Run daemon</p>
   <code>make server-start</code>
</p>
<p>
   <p>Run UI (Electron)</p>
   <code>make client-start</code>
</p>

# Deploy daemon as a service (Pi CM4)
<p><strong>Prerequisites:</strong></p>
<code>
sudo apt-get update
sudo apt-get install -y build-essential python3 make
sudo usermod -aG dialout,tty pi  # serial device access (logout/reboot after)
</code>

<p><strong>Install files (adjust path if needed)</strong></p>
<code>
sudo cp ops/cm4-serial-control.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cm4-serial-control.service   # autostart on boot
sudo systemctl start cm4-serial-control.service
journalctl -u cm4-serial-control.service -f        # follow logs
</code>

<p><strong>Edit the unit to match your path:</strong></p>
<code>
[Service]
WorkingDirectory=/opt/cm4-serial-control/packages/daemon
ExecStart=/usr/bin/node /opt/cm4-serial-control/packages/daemon/src/index.js
</code>

# UI on the Pi:

- Electron window in kiosk mode (kiosk: true, autoHideMenuBar: true, hide cursor via CSS).
- UI talks to daemon at ws://localhost:8081.
- No native modules in UI.

Build on the Pi (simplest for ARM) via:
<code>npm run build:ui</code>

# Protocol (1-liner)
<p><code> FF 00 00 00 03 | DEST | LEN | PAYLOAD | CHECKSUM</code>, where:</p>
<p><code> CHECKSUM = (256 - ((DEST + LEN + sum(PAYLOAD)) % 256)) % 256. </code></p>

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