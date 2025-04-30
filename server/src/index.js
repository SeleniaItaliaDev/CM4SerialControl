// server/src/index.js
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const buildPacket = require('./packet');
const perif2 = require('./buffers/perif2');
const perif3 = require('./buffers/perif3');
const perif10 = require('./buffers/perif10');
const perif11 = require('./buffers/perif11');

// === CONFIG ===
const SERIAL_PATH = '/dev/ttyAMA2';
const BAUD_RATE = 115200;
const WS_PORT = 8081;

let lastClient = null;

// === SERIAL SETUP ===
const port = new SerialPort({ path: SERIAL_PATH, baudRate: BAUD_RATE });
port.on('open', () => {
  console.log(`Serial port ${SERIAL_PATH} opened at ${BAUD_RATE} baud`);
});

// === INCOMING BUFFER PARSER ===
let rxBuffer = Buffer.alloc(0);

port.on('data', chunk => {
  rxBuffer = Buffer.concat([rxBuffer, chunk]);

  while (rxBuffer.length >= 6) {
    const start = rxBuffer.indexOf(Buffer.from([0xFF, 0x00, 0x00, 0x00, 0x03]));
    if (start === -1 || rxBuffer.length < start + 6) break;

    const offset = start + 5;
    const perifId = rxBuffer[offset];
    const length = rxBuffer[offset + 1];
    const totalLength = 5 + 1 + 1 + length + 1;

    if (rxBuffer.length < start + totalLength) break;

    const packet = rxBuffer.slice(start, start + totalLength);
    const payload = packet.slice(7, 7 + length);
    const receivedChecksum = packet[7 + length];
    const checksum = (perifId + length + payload.reduce((a, b) => a + b, 0)) % 256;
    const expectedChecksum = (256 - checksum) % 256;

    if (receivedChecksum === expectedChecksum) {
    console.log(`RX from perif ${perifId}:`, payload.toString('hex'));

      if (lastClient) {
        lastClient.send(JSON.stringify({
          from: perifId,
          payload: Array.from(payload)
        }));
      }
    } else {
      console.warn('Invalid checksum');
    }

    rxBuffer = rxBuffer.slice(start + totalLength);
  }
});

function sendBuffer(peripheral, payload) {
  const packet = buildPacket(peripheral, payload);
  port.write(packet, err => {
    if (err) return console.error('❌ Serial error:', err);
    console.log(`Sent to perif ${peripheral}:`, packet.toString('hex'));
  });
}

// === WS SERVER ===
const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`WebSocket server started on ws://localhost:${WS_PORT}`);
});

wss.on('connection', ws => {
  console.log('Client connected');
  lastClient = ws;

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      if (data.cmd === 'setLed') {
        if (data.peripheral === 10) perif10.state.ledValue = data.value;
        if (data.peripheral === 11) perif11.state.ledValue = data.value;
      } else {
        console.warn('Unknown command:', data);
      }
    } catch (err) {
      console.error('JSON error:', err);
    }
  });
});

// === TRANSMISSION INTERVAL ===
setInterval(() => {
    // sendBuffer(2, perif2.build(perif2.state));
    // sendBuffer(3, perif3.build(perif3.state));
    sendBuffer(10, perif10.build(perif10.state));
    // sendBuffer(11, perif11.build(perif11.state));
}, 100);
