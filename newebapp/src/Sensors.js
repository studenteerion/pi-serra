/*import { useState } from 'react';
import './Sensors.css';

let temperatura, umidita;

const Sensor = ({ title, value, progress, color }) => {
    const progressStyle = {
        '--p': progress,
        '--b': '10px',
        '--c': color,
    };

    return (
        <div className="sensors">
            <div className="pie" style={progressStyle}>{value}</div>
            <h2>{title}</h2>
        </div>
    );
};

const Sensors = () => {
    const [sensors, setSensors] = useState([
        { title: "Temperatura", value: `${temperatura}°C`, progress: `${temperatura}`, color: "#006fec" },
        { title: "Umidità Aria", value: `${umidita}%`, progress: `${umidita}` , color: "#006fec" },
    ]);

    const addSensor = () => {
        setSensors([...sensors, { title: "", value: "", progress: 0, color: "#006fec" }]);
    };

    const handleSensorChange = (index, updatedSensor) => {
        setSensors([
            ...sensors.slice(0, index),
            updatedSensor,
            ...sensors.slice(index + 1),
        ]);
    };

    return (
        <div className="Sensors-container">
            {sensors.map((sensor, index) => (
                <Sensor
                    key={index}
                    title={sensor.title}
                    value={sensor.value}
                    progress={sensor.progress}
                    color={sensor.color}
                    onChange={(updatedSensor) => handleSensorChange(index, updatedSensor)}
                />
            ))}
            <button onClick={addSensor}>Add Sensor</button>
        </div>
    );
};

export default Sensors;*/


import React, { useState, useEffect } from "react";
import "./Actuators.css";
import Button from "./Button";
import lampOn from "./images/lampon.png";
import lampOff from "./images/lampoff.png";

var actuatorTemplates = [
    {
        title: "Actuator 1",
        imageSrc: lampOff,
        imageAlt: "Actuator 1",
        isOn: false,
    },
    {
        title: "Actuator 2",
        imageSrc: lampOff,
        imageAlt: "Actuator 2",
        isOn: false,
    },
];

async function fetchHumidityAndTemperature() {
    try {
        const response = await fetch("http://example.com/api/humidity-temperature");
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error(error);
        throw error; // Throw the error to be caught by the caller
    }
}

function Sensors() {
    const [actuators, setActuators] = useState(actuatorTemplates);
    const [humidity, setHumidity] = useState(null);
    const [temperature, setTemperature] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            // Call the fetchHumidityAndTemperature function
            fetchHumidityAndTemperature()
                .then((data) => {
                    setHumidity(data.humidity);
                    setTemperature(data.temperature);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, 1000);

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    const toggleImage = (index) => {
        setActuators((prevActuators) => {
            const updatedActuators = [...prevActuators];
            updatedActuators[index] = {
                ...updatedActuators[index],
                imageSrc: updatedActuators[index].imageSrc === lampOff ? lampOn : lampOff,
            };
            return updatedActuators;
        });
    };

    return (
        <div>
            <h2>Humidity: {humidity}</h2>
            <h2>Temperature: {temperature}</h2>
            {actuators.map((actuator, index) => (
                <div className="actuators" key={index}>
                    <h2>{actuator.title}</h2>
                    <img src={actuator.imageSrc} alt={actuator.imageAlt} />
                    <button>
                        <Button />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Sensors;
