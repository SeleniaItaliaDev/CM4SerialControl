// server/src/index.js
const WebSocket = require('ws');
const { SerialPort } = require('serialport');

// === CONFIG ===
const SERIAL_PATH = '/dev/ttyAMA2';
const BAUD_RATE = 115200;
const WS_PORT = 8081;

// === DEVICE STATE BUFFERS ===
const state = {
  perif10: {
    ledValue: 0 // Bits 0–2
  },
  perif11: {
    ledValue: 0 // Bits 0 & 2 for LEDOD3, LEDep
  }
};

// === BUILD PACKET FUNCTION ===
function buildPacket(peripheral, payload) {
  const header = [0xFF, 0x00, 0x00, 0x00, 0x03];
  const length = payload.length;
  const checksum = (peripheral + length + payload.reduce((a, b) => a + b, 0)) % 256;
  const check = (256 - checksum) % 256;
  return Buffer.from([...header, peripheral, length, ...payload, check]);
}

// === PAYLOAD BUILDERS ===
function buildPerif10Payload(data) {
  return [128, 72, data.ledValue];
}

function buildPerif11Payload(data) {
  return [128, 72, data.ledValue];
}

// === SERIAL SETUP ===
const port = new SerialPort({ path: SERIAL_PATH, baudRate: BAUD_RATE });

port.on('open', () => {
  console.log(`✅ Serial port ${SERIAL_PATH} opened at ${BAUD_RATE} baud`);
});

port.on('data', buffer => {
  console.log('📥 Serial IN (raw):', buffer.toString('hex'));
});

// === RS485 SEND ===
function sendBuffer(peripheral, payload) {
  const packet = buildPacket(peripheral, payload);
  port.write(packet, err => {
    if (err) return console.error('❌ Serial error:', err);
    console.log(`✅ Sent to perif ${peripheral}:`, packet.toString('hex'));
  });
}

// === WS SERVER ===
const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`✅ WebSocket server started on ws://localhost:${WS_PORT}`);
});

wss.on('connection', ws => {
  console.log('🔌 Client connected');

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      if (data.cmd === 'setLed') {
        if (data.peripheral === 10) state.perif10.ledValue = data.value;
        if (data.peripheral === 11) state.perif11.ledValue = data.value;
      } else {
        console.warn('⚠️ Unknown command:', data);
      }
    } catch (err) {
      console.error('❌ JSON error:', err);
    }
  });
});

// === TRANSMISSION INTERVAL ===
setInterval(() => {
  sendBuffer(10, buildPerif10Payload(state.perif10));
  sendBuffer(11, buildPerif11Payload(state.perif11));
}, 100);
