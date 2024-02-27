import '../App.css';
import Header from '../components/header';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Panel() {
    const [onTemperature, setOnTemperature] = useState(0);
    const [sensorUpdateFrequency, setSensorUpdateFrequency] = useState(0);

    useEffect(() => {
        const socket = io('http://localhost:8080/pannello', { transports: ['websocket'] });
        socket.on('panelData', (data) => {
            setOnTemperature(data.onTemperature);
            setSensorUpdateFrequency(data.sensorUpdateFrequency);
        });
    }, []);

    const handleSave = () => {
        const socket = io('http://localhost:8080/pannello', { transports: ['websocket'] });
        const data = {
            onTemperature: onTemperature,
            sensorUpdateFrequency: sensorUpdateFrequency
        };
        socket.emit('updateConfigData', data);
    };

    return (
        <div>
            <Header index={1} />
            <div className='grid md:grid-cols-4 mt-16 p-1'>
                <div></div>
                <div className='md:col-span-2'>
                    <div className='p-3 rounded-md bg-sky-400 shadow-md flex flex-col gap-2 ' id='temperature'>
                        <div className='flex flex-col gap-1'>
                            <h4>Temperatura attivazione: </h4>
                            <input type='number' id='temperature-input' className='rounded-md p-1 w-full focus:outline-none' value={onTemperature} onChange={(e) => setOnTemperature(e.target.value)} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <h4>Frequenza aggiornamento: </h4>
                            <input type='number' id='temperature-input' className='rounded-md p-1 w-full focus:outline-none' value={sensorUpdateFrequency} onChange={(e) => setSensorUpdateFrequency(e.target.value)} />
                        </div>

                        <div className='text-center'>
                            <button className='px-3 py-2 rounded-md text-white font-semibold bg-green-600' onClick={handleSave}>Salva</button>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default Panel;
