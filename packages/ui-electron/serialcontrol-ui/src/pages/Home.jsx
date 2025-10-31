import { sendUpdateVoltage, sendUpdatedFrequency, sendStartTreatment, sendStopTreatment, sendUpdateMode } from '@/api/apiService';
import FrequencyPanel from '@/components/functional/FrequencyPanel';
import VoltagePanel from '@/components/functional/VoltagePanel';
import ModePanel from '@/components/functional/ModePanel';
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import '../styles/Home.css';
import '../App.css';

export default function Home({ ws, connected, currentTxState, txBuffer }) {
  const [started, setStarted] = useState(false);

  const startTreatment = () => {
    setStarted(true);
    sendStartTreatment(ws);
    toast.success('Trattamento avviato');
  }

  const stopTreatment = () => {
    setStarted(false);
    sendStopTreatment(ws);
    toast.warning('Trattamento fermato');
  }

  const changeFrequency = (frequency) => {
    sendUpdatedFrequency(ws, frequency);
  }

  const changeVoltage = (voltage) => {
    sendUpdateVoltage(ws, voltage);
  }

  const changeMode = (mode) => {
    sendUpdateMode(ws, mode);
  }

  return (
    <div className="flex flex-col align-center items-center justify-center h-screen w-screen gap-4 homeContainer">
      {!connected && <p className="ws-error">WebSocket Disconnected</p>}
      {currentTxState && <p className="tx-state">{currentTxState}</p>}
      {txBuffer && <p className="tx-buffer">TX Buffer: {txBuffer}</p>}
      <h1>Selenia - Teslamed</h1>

      <Separator className="my-4 w-3/4" />

      <div id='controls' className='flex align-center items-center justify-evenly w-full'>
        <FrequencyPanel onFrequencyChange={changeFrequency} />
        <Separator orientation='vertical' className='h-16' />
        <VoltagePanel onVoltageChange={changeVoltage} />
        <Separator orientation='vertical' className='h-16' />
        <ModePanel onModeChange={changeMode} />
      </div>

      <Separator className="my-4 w-3/4" />

      <div className='flex gap-6'>
        <Button variant='destructive' size='lg' id='stopButton' onClick={stopTreatment} disabled={!started}> STOP </Button>
        <Button id='startButton' size='lg' onClick={startTreatment} className={started ? 'blinking' : ''} disabled={started}> START </Button>
      </div>

      <div id='footer'>
        {started &&
          <p className='text-md text-gray-600'>
            <Info size={18} className='inline mb-1 mr-3' />
            Tenere premuto il pedale durante il trattamento
          </p>
        }
      </div>
    </div>
  );
}