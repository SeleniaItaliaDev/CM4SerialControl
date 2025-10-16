export const state = {
  epPulses: 0, // Byte 2
  rfVoltage: 0, // Byte 3
  epVMax: 0, // Byte 4
  epVMin: 0, // Byte 5
  epOn: false, // Bit 7 of Byte 6
  outputs: [false, false, false, false], // Bits 0–3 of Byte 6
  wImp: false, // Bit 4 of Byte 6
  rfOn: false, // Bit 4 of Byte 7
  rfFreq: 1, // 1=500KHz, 2=1MHz, 3=1.5MHz, 4=2MHz
  rfCurrent: 0, // Byte 8
  pwm5v: 0 // Byte 9
};
export function build(state) {
  const byte6 = (state.epOn ? 1 << 7 : 0) |
    (state.outputs[0] ? 1 << 0 : 0) |
    (state.outputs[1] ? 1 << 1 : 0) |
    (state.outputs[2] ? 1 << 2 : 0) |
    (state.outputs[3] ? 1 << 3 : 0) |
    (state.wImp ? 1 << 4 : 0);

  const byte7 = (() => {
    let freqBits = 0;
    if (state.rfFreq === 1) freqBits = 1;
    else if (state.rfFreq === 2) freqBits = 1 << 1;
    else if (state.rfFreq === 3) freqBits = 1 << 2;
    else if (state.rfFreq === 4) freqBits = 1 << 3;
    return (state.rfOn ? (1 << 4) : 0) | freqBits;
  })();

  return [
    128, 84,
    state.epPulses,
    state.rfVoltage,
    state.epVMax,
    state.epVMin,
    byte6,
    byte7,
    state.rfCurrent,
    state.pwm5v
  ];
}
  