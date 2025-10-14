
function buildPacket(peripheral, payload) {
    const header = [0xFF, 0x00, 0x00, 0x00, 0x03];
    const length = payload.length;
    const checksum = (peripheral + length + payload.reduce((a, b) => a + b, 0)) % 256;
    const check = (256 - checksum) % 256;
    return Buffer.from([...header, peripheral, length, ...payload, check]);
  }
  
  module.exports = buildPacket;
  