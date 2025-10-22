
/**
 * PAYLOAD STRUCTURE:
 * PAYLOAD[0] = Mittente (128 = Central)
 * PAYLOAD[1] = Comando (116)
 * PAYLOAD[2] = OUT [0-255]
 * PAYLOAD[3] = VOLT [0-255] Intensità uscita (Ampiezza)
 * PAYLOAD[4] = ADJ [0-255] PWM sul 40/400KHz (Frequenza)
 * PAYLOAD[5] = PWM [0-255] Intesità uscita (PWM) (solo per 400KHz)
 */

/**
 * Struttura del Byte OUT:
 * Bit 7: Riservato (0)
 * Bit 6: Riservato (0)
 * Bit 5: Riservato (0)
 * Bit 4: [0 = 40KHz / 1 = 400KHz]
 * Bit 3: Riservato (0)
 * Bit 2: Riservato (0)
 * Bit 1: [0 = Modalità Continua / 1 = Modalità Pulsata]
 * Bit 0: [0 = OFF / 1 = ON]
 */

// Central/controller ID that the board expects first in payload 
const CENTRAL_ID = 128;
const CMD = 't'.charCodeAt(0); // 't' char code is 116

// Define flag constants
const FLAG_POWER = 1 << 0;      // 0b00000001 - Mette il bit 0 a 1
const FLAG_PULSMODE  = 1 << 1;  // 0b00000010 - Mette il bit 1 a 1
const FLAG_FREQ400KHZ = 1 << 4; // 0b00010000 - Mette il bit 4 a 1

export type Perif33StateType = {
    power: 'on' | 'off';    // on, off
    mode: 'cont' | 'puls'; // cont, puls
    freq: 40 | 400;   // 40 or 400 (kHz)
    volt: number;     // 0-255
    adj: number;      // 0-255
    pwm: number;      // 0-255 (only for 400kHz mode)
};

export const state: Perif33StateType = {
    power: 'off',   // on, off
    mode: 'cont',   // puls / cont
    freq: 400,      // 40 or 400 (kHz)
    volt: 0,        // 0-255
    adj: 0,         // 0-255
    pwm: 0          // 0-255 (only for 400kHz mode)
};

export const buffer_communication_state = {
    last_tx: 0,
    last_rx: 0,
    rx_waiting: false
}

/**
 * Build TX payload to send to perif 33 for this command.
 * @param state Current state
 * @returns Array of bytes to send
 */
export function build(): number[] {
    let out = 0;

    if (state.power === 'on') out |= FLAG_POWER;
    if (state.mode === 'puls') out |= FLAG_PULSMODE;
    if (state.freq === 400) out |= FLAG_FREQ400KHZ;

    const volt = Math.max(0, Math.min(255, state.volt || 0));
    const adj = Math.max(0, Math.min(255, state.adj || 0));
    const pwm = Math.max(0, Math.min(255, state.pwm || 0));

    return [CENTRAL_ID, CMD, out, volt, adj, pwm];
}

/**
 * Decode RX payload coming back from perif 33 for this command.
 * Shape depends on your PDF. This is a stub that pulls a few bytes.
 */
export function decodePerif33Rx(payload: Uint8Array) {
    // Sanity checks
    if (payload.length < 3) return null;

    const from = payload[0];                // e.g., 33 (device ID echoed)
    const cmd = String.fromCharCode(payload[1]); // 't' (or whatever your board returns)
    // Example: third byte could be a status/inputs bitfield, adjust to your PDF:
    const status = payload[2];

    return { from, cmd, status, raw: Array.from(payload) };
}

export * as Perif33 from './perif33.ts';