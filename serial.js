import SerialPort from 'serialport';

// CONFIG
const portPath = '/dev/ttyAMA2';
const baudRate = 115200;

const port = new SerialPort(portPath, {
  baudRate,
  autoOpen: true
});

function buildPacket(peripheral, payload) {
  const header = [0xFF, 0x00, 0x00, 0x00, 0x03];
  const length = payload.length;
  const checksum = (peripheral + length + payload.reduce((a, b) => a + b, 0)) % 256;
  const check = (256 - checksum) % 256;
  return Buffer.from([...header, peripheral, length, ...payload, check]);
}

async function sendLedCommand(on) {
  const payload = [128, 72, on ? 7 : 0];  // LED mode
  const packet = buildPacket(10, payload);

  return new Promise((resolve, reject) => {
    port.write(packet, (err) => {
      if (err) return reject(err);
      port.drain(() => resolve('LED command sent'));
    });
  });
}

export default { sendLedCommand };
