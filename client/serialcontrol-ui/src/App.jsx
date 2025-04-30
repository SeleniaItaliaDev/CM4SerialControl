import { useState } from 'react';

export default function App() {
  const [ws, setWs] = useState(null);
  const [ledOn, setLedOn] = useState(false);

  const connect = () => {
    const socket = new WebSocket('ws://localhost:8081');
    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (event) => console.log('WS:', event.data);
    socket.onerror = (err) => console.error('WS Error:', err);
    setWs(socket);
  };

  const toggleLed = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const newValue = ledOn ? true : false;
    ws.send(JSON.stringify({ cmd: 'setLed', peripheral: 10, value: newValue }));
    setLedOn(!ledOn);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-xl font-bold">RS485 Control Panel</h1>
      <button onClick={connect} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Connect</button>
      <button onClick={toggleLed} className="bg-green-500 text-white px-4 py-2 rounded-xl">
        {ledOn ? 'Turn OFF LED' : 'Turn ON LED'}
      </button>
    </div>
  );
}
