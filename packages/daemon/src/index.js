import { SerialPort } from 'serialport';
import WebSocket, { WebSocketServer } from 'ws';
import { startTxLoop } from './tx_loop.js';
import { attachRx } from './rx.js';
import { Perif33 } from './buffers/perif33.js';

const rxState = { last: null, lastSeenAt: 0 };
const txState = Perif33.state;

const port = new SerialPort({ path: process.env.SERIAL_PATH || '/dev/ttyAMA2', baudRate: 115200 });
port.on('open', () => console.log('✅ serial open'));
port.on('error', e => console.error('serial error', e));

const wss = new WebSocketServer({ port: 8081 }, () => console.log('✅ WS ws://localhost:8081'));
const broadcast = (obj) => {
  const s = JSON.stringify(obj);
  for (const c of wss.clients) if (c.readyState === WebSocket.OPEN) c.send(s);
};

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ event: 'hello', perif: 33, tx: txState, rx: rxState }));
  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      if (msg.cmd === 'set33') {
        if (Number.isInteger(msg.mode)) txState.mode = msg.mode & 0xFF;
        if (Number.isInteger(msg.speed)) txState.speed = msg.speed & 0xFF;
        if (Number.isInteger(msg.direction)) txState.direction = msg.direction & 0xFF;
        if (Number.isInteger(msg.duration)) txState.duration = msg.duration & 0xFF;
        ws.send(JSON.stringify({ event: 'ack', cmd: 'set33', ok: true, tx: txState }));
      }
    } catch (e) {
      ws.send(JSON.stringify({ event: 'error', message: e.message }));
    }
  });
});

attachRx(port, rxState, broadcast);
startTxLoop(port, txState, 100);
