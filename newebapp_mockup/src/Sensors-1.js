import { useState } from 'react';
import './Sensors-1.css';

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
        { title: "Temperatura", value: "26 °C", progress: 26, color: "#006fec" },
        { title: "Umidità Aria", value: "70%", progress: 70, color: "#006fec" },
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

export default Sensors;