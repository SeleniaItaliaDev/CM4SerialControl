import { useState } from 'react';
import { toast } from 'sonner';
import '../styles/Home.css';

export default function Home( { ws, connected } ) {
  const [ledOn, setLedOn] = useState(false);

  const toggleLed = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.warning('WebSocket is not connected');
      return;
    }

    // ideally here we should have 2 functions, one for ON and one for OFF
    // or at least a single function that accepts a boolean parameter
    const newValue = ledOn ? true : false;
    ws.send(JSON.stringify({ cmd: 'setLed', peripheral: 10, value: newValue }));
    setLedOn(!ledOn);
  };

  return (
    <div className="flex flex-col align-center items-center justify-center h-screen w-screen gap-4">
      {!connected && <p className="ws-error">WebSocket Disconnected</p>}
      <h1>RS485 Control Panel</h1>

      <button onClick={toggleLed}>
        {ledOn ? 'Turn OFF LED' : 'Turn ON LED'}
      </button>
    </div>
  );
}