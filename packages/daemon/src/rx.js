import { parseFrames } from './protocol_frame.js';
import { decodePerif33Rx } from './buffers/perif33.js';

export function attachRx(port, rxState, wsBroadcast) {
    let acc = Buffer.alloc(0);
    port.on('data', (chunk) => {
        acc = Buffer.concat([acc, chunk]);
        for (const f of parseFrames(acc)) {
            if (!f.ok) continue;
            if (f.dest === 33) {
                const msg = decodePerif33Rx(f.payload);
                if (msg) {
                    rxState.last = msg;
                    rxState.lastSeenAt = Date.now();
                    wsBroadcast({ event: 'telemetry', perif: 33, data: msg });
                }
            } else {
                wsBroadcast({ event: 'raw', perif: f.dest, payload: Array.from(f.payload) });
            }
        }
        // if you modify parseFrames to return leftover, keep it here
        // acc = leftover;
    });
}
