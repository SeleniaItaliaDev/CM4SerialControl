import FrequencyPanel from '@/components/functional/FrequencyPanel';
import VoltagePanel from '@/components/functional/VoltagePanel';
import { COMMAND_TYPES } from '../../../../../shared/messageTypes';
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import { sendCommand } from '@/api/apiService';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import '../styles/Home.css';
import '../App.css';

export default function Home({ connected }) {
  const [started, setStarted] = useState(false);

  const startTreatment = () => {
    setStarted(true);
    sendCommand(COMMAND_TYPES.START_TREATMENT);
    toast.success('Trattamento avviato');
  }

  const stopTreatment = () => {
    setStarted(false);
    sendCommand(COMMAND_TYPES.STOP_TREATMENT);
    toast.warning('Trattamento fermato');
  }

  return (
    <div className="flex flex-col align-center items-center justify-center h-screen w-screen gap-4 homeContainer">
      {!connected && <p className="ws-error">WebSocket Disconnected</p>}
      <h1>Selenia - Teslamed</h1>

      <Separator className="my-4 w-3/4" />

      <div id='controls' className='flex align-center items-center justify-evenly w-full'>
        <FrequencyPanel />
        <VoltagePanel />
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