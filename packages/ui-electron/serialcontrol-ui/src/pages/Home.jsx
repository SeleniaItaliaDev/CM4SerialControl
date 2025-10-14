import '../styles/Home.css';
import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"


export default function Home({ ws, connected }) {
  const [ledOn, setLedOn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [frequency, setFrequency] = useState(400); // default to 400KHz
  const [voltage, setVoltage] = useState(80); // default to 80V

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

  const toggle40or400KHz = () => {
    setChecked(!checked);
    // if checked is true, set to 40KHz, else set to 400KHz
    const newFrequency = checked ? 400 : 40;
    setFrequency(newFrequency);
  }

  const handleVoltageChange = (value) => {
    setVoltage(value);
  }

  return (
    <div className="flex flex-col align-center items-center justify-center h-screen w-screen gap-4 homeContainer">
      {!connected && <p className="ws-error">WebSocket Disconnected</p>}
      <h1>Selenia - Teslamed</h1>

      {/* <button onClick={toggleLed} className='text-white'>
        {ledOn ? 'Turn OFF LED' : 'Turn ON LED'}
      </button> */}
      
      <Separator className="my-4 w-3/4" />

      <div id='controls' className='flex gap-20 align-center items-center justify-center w-full'>
        <div className='flex flex-col gap-2 align-center items-center justify-center w-1/3'>
          <div className="flex items-center justify-between gap-1">
            <p htmlFor="frequency" className='font-medium'>Mode: </p>
            <span className="text-md">{frequency} KHz</span>
          </div>
          <div className='flex gap-2 align-center items-center justify-center'>
            <p className='font-bold text-sm'>400 KHz</p>
            <Switch checked={checked} onCheckedChange={toggle40or400KHz} />
            <p className='font-bold text-sm'>40 KHz</p>
          </div>
        </div>

        <div className='flex flex-col gap-2 align-center items-center justify-center w-1/3'>
          <div className="flex items-center justify-between gap-1">
            <p htmlFor="voltage" className='font-medium'>Voltage: </p>
            <span className="text-md">{voltage} V</span>
          </div>
          <Slider
            defaultValue={[voltage]}
            max={150}
            min={50}
            step={1}
            onValueChange={(value) => handleVoltageChange(value[0])}
          />
          <span className='w-full flex justify-between text-xs px-1'>
            <p> Min: 50 </p>
            <p> Max: 150 </p>
          </span>
        </div>
      </div>

      <div id='footer'>
        <p className='text-md'>Per attivare il manipolo, tenere premuto il pedale</p>
      </div>
    </div>
  );
}