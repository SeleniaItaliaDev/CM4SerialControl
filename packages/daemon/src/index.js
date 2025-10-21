import { SerialPort } from 'serialport';
import WebSocket, { WebSocketServer } from 'ws';
import { startTxLoop } from './tx_loop.js';
import { attachRx } from './rx.js';
import { Perif33 } from './buffers/perif33.ts';

const rxState = { last: null, lastSeenAt: 0 };

const port = new SerialPort({ path: process.env.SERIAL_PATH || '/dev/ttyAMA2', baudRate: 115200 });
port.on('open', () => console.log('✅ serial open'));
port.on('error', e => console.error('serial error', e));

const wss = new WebSocketServer({ port: 8081 }, () => console.log('✅ WS ws://localhost:8081'));
const broadcast = (obj) => {
  const s = JSON.stringify(obj);
  for (const c of wss.clients) if (c.readyState === WebSocket.OPEN) c.send(s);
};

wss.on('connection', (ws) => {
  console.log('✅ WS client connected');
  ws.send(JSON.stringify({ event: 'hello', perif: 33, tx: Perif33.state, rx: rxState }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      // Based on command, handle appropriately
      switch (msg.cmd) {
        case 'SET_FREQUENCY':
          if (msg.frequency && Number.isInteger(msg.frequency)) {
            Perif33.state.freq = msg.frequency;
          }
          break;
        case 'SET_VOLTAGE':
          if (msg.voltage && Number.isInteger(msg.voltage) && msg.voltage >= 50 && msg.voltage <= 150) {
            Perif33.state.volt = msg.voltage;
          }
          break;
        case 'START_TREATMENT':
          Perif33.state.mode = 'cont';
          break;
        case 'STOP_TREATMENT':
          Perif33.state.mode = 'off';
          break;
      }
      ws.send(JSON.stringify({ event: 'emitState', perif: 33, tx: Perif33.state }));
    } catch (e) {
      ws.send(JSON.stringify({ event: 'error', message: e.message }));
    }
  });
});

attachRx(port, rxState, broadcast);
startTxLoop(port, 100);
