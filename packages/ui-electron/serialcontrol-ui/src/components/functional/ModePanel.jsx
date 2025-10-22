
import React, { useState, useEffect } from 'react';
import { Switch } from '../ui/switch';

export default function ModePanel({ onModeChange }) {
    const [mode, setMode] = useState('cont');

    useEffect(() => {
        onModeChange(mode);
    }, [mode]);

    const [checked, setChecked] = useState(false); // false means 'cont', true means 'puls'
    const toggleMode = () => {
        const newChecked = !checked;
        setChecked(newChecked);

        setMode(newChecked ? 'puls' : 'cont');
    }

    return (

        <div className='flex flex-col gap-2 align-center items-center justify-center w-1/3'>
            <div className="flex items-center justify-between gap-1 mb-3">
                <p htmlFor="frequency" className='font-medium'>Modalità</p>
            </div>
            <div className='flex gap-2 align-center items-center justify-center'>
                <p className='font-bold text-sm'>Continua</p>
                <Switch checked={checked} onCheckedChange={toggleMode} />
                <p className='font-bold text-sm'>Pulsata</p>
            </div>
        </div>

    );
}