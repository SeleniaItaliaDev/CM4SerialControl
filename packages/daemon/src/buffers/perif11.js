export const state = {
  mode: 72,
  ledOd3: false,
  ledEp: false,
  value: 0,
  address: 0
};
export function build(state) {
  if (state.mode === 'w') {
    return [128, 'w'.charCodeAt(0), state.value, state.address];
  } else if (state.mode === 'r') {
    return [128, 'r'.charCodeAt(0), state.address, 0];
  } else if (state.mode === 72) {
    const val = state.ledOd3 ? 5 : (state.ledEp ? 3 : 0);
    return [128, 72, val];
  } else {
    return [128, 72, 0];
  }
}
  