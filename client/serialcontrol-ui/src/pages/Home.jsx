import { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
    const [ws, setWs] = useState(null);
    const [ledOn, setLedOn] = useState(false);
  
    const connect = () => {
      const socket = new WebSocket('ws://localhost:8081');
      socket.onopen = () => toast.success('WebSocket connection established');
      socket.onmessage = (event) => toast.success(`Message from server: ${event.data}`);
      socket.onerror = (err) => toast.error(`WebSocket error: ${err.message}`);
      setWs(socket);
    };
  
    const toggleLed = () => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        toast.error('WebSocket is not connected');
        return;
      }
      const newValue = ledOn ? true : false;
      ws.send(JSON.stringify({ cmd: 'setLed', peripheral: 10, value: newValue }));
      setLedOn(!ledOn);
    };

    return (
        <div className="flex flex-col align-center items-center justify-center h-screen w-screen gap-4">
            <h1 className="text-xl font-bold">RS485 Control Panel</h1>

            <button onClick={connect} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Connect</button>
            <button onClick={toggleLed} className="bg-green-500 text-white px-4 py-2 rounded-xl">
                {ledOn ? 'Turn OFF LED' : 'Turn ON LED'}
            </button>
        </div>
    );
}