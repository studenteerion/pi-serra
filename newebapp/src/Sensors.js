import React, { useState } from "react";
import "./Sensors.css";
import thermometer from "./images/thermometer.png";
import humidity from "./images/humidity.png";
import add from "./images/add.png";
import sensor from "./images/sensor.png";
import remove from "./images/delete.png";

let sensorTemplates = [
    {
        title: "Temperature",
        imageSrc: thermometer,
        imageAlt: "Temperature",
        isOn: false,
        value: "23.5 °C",
    },
    {
        title: "Humidity",
        imageSrc: humidity,
        imageAlt: "Humidity",
        isOn: false,
        value: "87%",
    },
];

const imageOptions = [
    { src: thermometer, alt: "Thermometer" },
    { src: humidity, alt: "Humidity" },
    { src: sensor, alt: "Sensor" },
    // Add more image options here
];

function Sensors({ isCol1Expanded }) {
    const [sensors, setSensors] = useState(sensorTemplates);
    const addSensor = () => {
        const title = prompt("Enter the title for the new sensor:");
        if (title) {
            const selectedImage = prompt("Select the image for the new sensor:\n\n" +
                imageOptions.map((option, index) => `${index + 1}. ${option.alt}`).join("\n"));
            if (selectedImage) {
                const imageIndex = parseInt(selectedImage) - 1;
                if (imageIndex >= 0 && imageIndex < imageOptions.length) {
                    const ip = prompt("Enter the IP for the new sensor:");
                    if (ip) {
                        const newSensor = {
                            title: title,
                            imageSrc: imageOptions[imageIndex].src,
                            imageAlt: imageOptions[imageIndex].alt,
                            value: "No data",
                            isOn: false,
                            ip: ip,
                        };
                        setSensors((prevSensors) => [...prevSensors, newSensor]);
                    } else {
                        alert("Invalid IP.");
                    }
                } else {
                    alert("Invalid image selection.");
                }
            }
        }
    };

    const deleteSensor = (index) => {
        setSensors((prevSensors) => {
            const updatedSensors = [...prevSensors];
            updatedSensors.splice(index, 1);
            return updatedSensors;
        });
    };

    return (
        <div className="sensors-container">
            <div className="sensors-row">
                {sensors.map((sensor, index) => (
                    <div className="sensor" key={index}>
                        {isCol1Expanded && (
                            <button className="delete-sensor" onClick={() => deleteSensor(index)}>
                                <img src={remove} alt="Delete" />
                            </button>
                        )}
                        <h2>{sensor.title}</h2>
                        <img src={sensor.imageSrc} alt={sensor.imageAlt} />
                        <h2>{sensor.value}</h2>
                    </div>
                ))}
                {isCol1Expanded && (
                    <div className="add-sensor">
                        <h2>Add Sensor</h2>
                        <img src={add} alt="Add Sensor" onClick={addSensor} />
                    </div>
                )}
            </div>
        </div>
    );
}
export default Sensors;