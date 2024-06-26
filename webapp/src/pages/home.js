import '../App.css';
import Header from '../components/header';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

//axios
//import axios from 'axios';

function Home() {
    const [humidity, setHumidity] = useState('');
    const [temperature, setTemperature] = useState('');

    useEffect(() => {
        const socket = io('http://localhost:8080/main-ws', { transports: ['websocket'] });
        socket.on('updateData', (data) => {
            console.log(data);
            if (data.Humidity === undefined)
                setHumidity("Errore");
            else
                setHumidity(data.Humidity + '%');

            if (data.Temperature === undefined)
                setTemperature("Errore");
            else
                setTemperature(data.Temperature + '°');
        });
    }, []);

    return (
        <div>
            <Header index={0} />
            <div className='grid md:grid-cols-4 mt-16 p-1'>
                <div></div>
                <div className='md:col-span-2 grid md:grid-cols-2 gap-1'>
                    <div className=' bg-sky-600 card'>
                        <h3>Temperatura attuale:</h3>
                        <h2>{temperature}</h2>
                    </div>
                    <div className=' bg-orange-400 card'>
                        <h3>Umidità aria</h3>
                        <h2>{humidity}</h2>
                    </div>
                    <div className=' bg-emerald-600 card'>
                        <h3>Umidità Terreno</h3>
                        <h2>--</h2>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default Home;