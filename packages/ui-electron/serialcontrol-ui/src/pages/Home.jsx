import '../styles/Home.css';
import { useState } from 'react';
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator"
import VoltagePanel from '@/components/functional/VoltagePanel';
import FrequencyPanel from '@/components/functional/FrequencyPanel';


export default function Home({ ws, connected }) {
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
    <div className="flex flex-col align-center items-center justify-center h-screen w-screen gap-4 homeContainer">
      {!connected && <p className="ws-error">WebSocket Disconnected</p>}
      <h1>Selenia - Teslamed</h1>

      {/* <button onClick={toggleLed} className='text-white'>
        {ledOn ? 'Turn OFF LED' : 'Turn ON LED'}
      </button> */}
      
      <Separator className="my-4 w-3/4" />

      <div id='controls' className='flex gap-20 align-center items-center justify-center w-full'>
        
        <FrequencyPanel />
        <VoltagePanel  />

      </div>

      <div id='footer'>
        <p className='text-md'>Per attivare il manipolo, tenere premuto il pedale</p>
      </div>
    </div>
  );
}