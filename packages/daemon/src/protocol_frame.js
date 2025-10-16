// Frame protocol

const HEADER = Buffer.from([0xFF, 0x00, 0x00, 0x00, 0x03]);

function checksum(peripheral, payload) {
  const sum = peripheral + payload.length + payload.reduce((a, b) => a + b, 0);
  return (256 - (sum % 256)) % 256;
}

function buildFrame(peripheral, payloadArr) {
  const payload = Buffer.from(payloadArr);
  const chk = checksum(peripheral, payload);
  return Buffer.concat([HEADER, Buffer.from([peripheral, payload.length]), payload, Buffer.from([chk])]);
}

function* parseFrames(buf) {
  let b = Buffer.from(buf);
  while (true) {
    const i = b.indexOf(HEADER);
    if (i < 0 || b.length < i + 7) break;
    const dest = b[i + 5];
    const len = b[i + 6];
    const need = 5 + 1 + 1 + len + 1;
    if (b.length < i + need) break;
    // const payload = b.slice(i + 7, i + 7 + len); // slice is deprecated
    const payload = b.subarray(i + 7, i + 7 + len);
    const rxChk = b[i + 7 + len];
    const ok = rxChk === checksum(dest, payload);
    yield { dest, payload, ok };
    // b = b.slice(i + need); // slice is deprecated
    b = b.subarray(i + need);
  }
  return b; // leftover (if you want to keep it)
}

export { buildFrame, parseFrames };
