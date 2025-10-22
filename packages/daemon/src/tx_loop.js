import { buildFrame } from './protocol_frame.js';
import { Perif33 } from './buffers/perif33.ts';

export function startTxLoop(port, periodMs = 100) {
    return setInterval(() => {
        const payload = Perif33.build();
        const frame = buildFrame(33, payload);
        Perif33.buffer_communication_state.last_tx = frame;
        port.write(frame, (err) => {
            if (err) return console.error('TX error:', err);
            port.drain(() => { }); // half-duplex safety point
        });
    }, periodMs);
}
