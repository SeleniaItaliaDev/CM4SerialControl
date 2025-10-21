import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Minus } from 'lucide-react';
import '../../App.css'


export default function VoltagePanel({ onVoltageChange }) {
    const [voltage, setVoltage] = useState(80); // default to 80V
    const MAX_VOLTAGE = 200;
    const MIN_VOLTAGE = 50;

    const increaseVoltage = () => {
        let newVoltage = voltage;
        newVoltage += (voltage >= MAX_VOLTAGE) ? 0 : 5;
        setVoltage(newVoltage);
    }

    const decreaseVoltage = () => {
        let newVoltage = voltage;
        newVoltage -= (voltage <= MIN_VOLTAGE) ? 0 : 5;
        setVoltage(newVoltage);
    }

    useEffect(() => {
        onVoltageChange(voltage);
    }, [voltage]);

    return (
        <div className='flex flex-col gap-2 align-center items-center justify-center w-1/4'>

            <div className="flex items-center justify-between gap-1">
                <p htmlFor="voltage" className='font-medium'>Voltage</p>
            </div>

            <div className="flex gap-4 items-center w-full justify-between">
                <Button
                    size='icon'
                    onClick={decreaseVoltage}>
                    <Minus size={16} />
                </Button>

                <p className='text-lg'>{voltage}</p>

                <Button
                    size='icon'
                    onClick={increaseVoltage}>
                    <Plus size={16} />
                </Button>
            </div>

            <span className='w-full flex justify-between text-xs px-1'>
                <p> Min: 50 </p>
                <p> Max: 150 </p>
            </span>
        </div>

    );
}