import { sendUpdateVoltage, sendUpdatedFrequency, sendStartTreatment, sendStopTreatment, sendUpdateMode } from '@/api/apiService';
import CameraControlPanel from '@/components/functional/CameraControlPanel';
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
import { useNavigate } from 'react-router-dom';

export default function Sinepil({ ws, connected, currentTxState, txBuffer }) {
    const [started, setStarted] = useState(false);
    const navigate = useNavigate();

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

    const navigateToCamera = () => {
        navigate('/sinepil');
    }

    return (
        <div className="flex flex-col align-center items-center justify-center h-screen w-screen gap-4 homeContainer">
            {/* <h1>Selenia - Sinepil</h1> */}
            {/* <Separator className="my-4 w-3/4" /> */}
            {/* <Button variant='outline' size='sm' onClick={navigateToCamera}> AVVIA CAMERA </Button> */}


            <CameraControlPanel />



            {/* <div className='flex gap-6'>
                <Button variant='destructive' size='lg' id='stopButton' onClick={stopTreatment} disabled={!started}> STOP </Button>
                <Button id='startButton' size='lg' onClick={startTreatment} className={started ? 'blinking' : ''} disabled={started}> START </Button>
            </div> */}
        </div>
    );
}