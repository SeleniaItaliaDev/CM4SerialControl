// server/src/index.js

const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// CONFIG
const SERIAL_PATH = '/dev/ttyAMA2';
const BAUD_RATE = 115200;
const PORT = 8081;

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });
console.log(`✅ WebSocket server started on ws://localhost:${PORT}`);

// Setup serial connection
const port = new SerialPort({ path: SERIAL_PATH, baudRate: BAUD_RATE });

port.on('open', () => console.log(`✅ Serial port ${SERIAL_PATH} opened at ${BAUD_RATE} baud`));
port.on('error', err => console.error('❌ Serial error:', err.message));

// Optional: for debugging serial input
const parser = port.pipe(new ReadlineParser());
parser.on('data', data => console.log('📥 Serial IN:', data));

function buildPacket(peripheral, payload) {
  const header = [0xFF, 0x00, 0x00, 0x00, 0x03];
  const len = payload.length;
  const checksum = (peripheral + len + payload.reduce((a, b) => a + b, 0)) % 256;
  const check = (256 - checksum) % 256;
  return Buffer.from([...header, peripheral, len, ...payload, check]);
}

function sendLedCommand(peripheral, value) {
  const payload = [128, 72, value];
  const packet = buildPacket(peripheral, payload);
  port.write(packet, err => {
    if (err) console.error('❌ Write error:', err);
    else console.log(`✅ Sent to perif ${peripheral}:`, packet.toString('hex'));
  });
}

wss.on('connection', ws => {
  console.log('🔌 Client connected');

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      if (data.cmd === 'setLed') {
        sendLedCommand(data.peripheral, data.value);
      } else {
        console.warn('⚠️ Unknown command:', data);
      }
    } catch (err) {
      console.error('❌ Message error:', err);
    }
  });
});
