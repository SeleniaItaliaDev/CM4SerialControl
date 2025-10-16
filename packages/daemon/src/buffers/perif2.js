export const state = {
  usMode: 0, // 0=manual, 1=semi, 2=auto
  usVoltage: 0, // Byte 4
  fanExt: false, // Byte 5, bit 1
  fanPcb: false, // Byte 5, bit 2
  usOff: false, // Used in mode logic
  cerMax: false, // Byte 6, bit 4
  resOcUs: false, // Byte 6, bit 3
  freqUs: 0, // 0=1MHz, 1=3MHz, 2=3.4MHz (Byte 6)
  vacOn: false,
  vacPot: 0,
  frequenza: 0,
  wTon: 0,
  wToff: 0
};
export function build(state) {
  const b5 = (state.fanExt ? 1 << 1 : 0) |
    (state.fanPcb ? 1 << 2 : 0);

  let b6 = 0;
  if (state.usMode === 0) b6 |= 1 << 7;
  else if (state.usMode === 1) b6 |= 1 << 6;
  else if (state.usMode === 2) b6 |= 1 << 5;
  if (state.usOff) b6 &= ~(1 << 5 | 1 << 6 | 1 << 7);
  if (state.cerMax) b6 |= 1 << 4;
  if (state.resOcUs) b6 |= 1 << 3;
  if (state.freqUs === 1) b6 |= 1 << 2;
  else if (state.freqUs === 2) b6 |= 1 << 1 | 1 << 2;

  const fL = state.frequenza & 0xFF;
  const fH = state.frequenza >> 8;

  return [
    128, 84,
    0, 0,
    state.usVoltage,
    b5,
    b6,
    0,
    state.vacOn ? state.vacPot : 0,
    0,
    fL,
    fH,
    state.wTon,
    state.wToff
  ];
}
  