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

const id = ["a1736624-0f33-4c20-a04e-e8a6a059d2c4", "d074cada-9be2-4749-90ae-1271f0a27fcc"];

async function checkStatus(id) {
    console.log("checkStatus");

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "9mns924xqak1nkqmkjnpas01742bsino");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(`http://localhost:8080/controls/${id}`, requestOptions);
        const data = await response.json();
        console.log(data.values[0].Value);
        return data.values[0].Value; // Return the value
    } catch (error) {
        console.error(error);
    }
}

function Actuators() {
    const [actuators, setActuators] = useState(actuatorTemplates);

    useEffect(() => {
        const interval = setInterval(() => {
            // Call the checkStatus function for each actuator
            id.forEach(async (actuatorId, index) => {
                const value = await checkStatus(actuatorId);
                setActuators((prevActuators) => {
                    const updatedActuators = [...prevActuators];
                    updatedActuators[index] = {
                        ...updatedActuators[index],
                        imageSrc: value == "1" ? lampOff : lampOn,
                    };
                    return updatedActuators;
                });
            });
        }, 3000);

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


/*const Actuator = ({title, images, onChange}) => {
    const [isOn, setIsOn] = useState(false);

    const toggleImage = () => {
        setIsOn((prevIsOn) => !prevIsOn);
        onChange({title, images: [isOn ? lampOff : lampOn, isOn ? lampOn : lampOff]});
    };

    return (
        <div className="actuators">
            <h2>{title}</h2>
            <img src={isOn ? images[1] : images[0]} alt="Actuator"/>
            <Button onClick={toggleImage}/>
        </div>
    );
};

const Actuators = () => {
    const [actuators, setActuators] = useState([
        {title: "Lampada", images: [lampOff, lampOn]},
        {title: "Ventola", images: [lampOn, lampOff]},
    ]);

    const addActuator = () => {
        setActuators((prevActuators) => [
            ...prevActuators,
            {title: "", images: ["/path/to/image1.jpg", "/path/to/image2.jpg"]},
        ]);
    };

    const handleActuatorChange = (index, updatedActuator) => {
        setActuators((prevActuators) => [
            ...prevActuators.slice(0, index),
            updatedActuator,
            ...prevActuators.slice(index + 1),
        ]);
    };

    return (
        <div className="Actuators-container">
            {actuators.map((actuator, index) => (
                <Actuator
                    key={index}
                    title={actuator.title}
                    images={actuator.images}
                    onChange={(updatedActuator) => handleActuatorChange(index, updatedActuator)}
                />
            ))}
            <button onClick={addActuator}>Add Actuator</button>
        </div>
    );
};*/

export default Actuators;