
import React, { useState, useEffect } from 'react';
import { Switch } from '../ui/switch';

const FREQUENCY_MODE = {
    '400KHz': 400,
    '40KHz': 40
}

export default function FrequencyPanel({ onFrequencyChange }) {
    const [frequencyMode, setFrequencyMode] = useState(FREQUENCY_MODE['400KHz']);
    const [checked, setChecked] = useState(false); // false means 400KHz, true means 40KHz


    const toggle40or400KHz = () => {
        const newChecked = !checked;
        setChecked(newChecked);

        setFrequencyMode(newChecked ? FREQUENCY_MODE['40KHz'] : FREQUENCY_MODE['400KHz']);
    }

    useEffect(() => {
        onFrequencyChange(frequencyMode);
    }, [frequencyMode]);

    return (

        <div className='flex flex-col gap-2 align-center items-center justify-center w-1/3'>
            <div className="flex items-center justify-between gap-1 mb-3">
                <p htmlFor="frequency" className='font-medium'>Frequenza</p>
            </div>
            <div className='flex gap-2 align-center items-center justify-center'>
                <p className='font-bold text-sm'>400 KHz</p>
                <Switch checked={checked} onCheckedChange={toggle40or400KHz} />
                <p className='font-bold text-sm'>40 KHz</p>
            </div>
        </div>

    );
}