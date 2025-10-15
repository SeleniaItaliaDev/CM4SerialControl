import React, { useState } from 'react';
import { Slider } from '../ui/slider';


export default function VoltagePanel() {
    const [voltage, setVoltage] = useState(80); // default to 80V

    const handleVoltageChange = (newVoltage) => {
        setVoltage(newVoltage);
        // Here you would typically also notify the backend or perform some action based on the new voltage
    }

    return (
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

    );
}