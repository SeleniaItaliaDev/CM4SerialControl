import { buildFrame } from './protocol_frame.js';
import { Perif33 } from './buffers/perif33.ts';

export function startTxLoop(port, txState, periodMs = 100) {
    return setInterval(() => {
        const payload = Perif33.build(txState);
        const frame = buildFrame(33, payload);
        port.write(frame, (err) => {
            if (err) return console.error('TX error:', err);
            port.drain(() => { }); // half-duplex safety point
        });
    }, periodMs);
}
