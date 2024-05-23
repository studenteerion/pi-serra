import React, {useState} from "react";
import "./Actuators.css";
import Button from "./Button";
import lampOn from "./images/lampon.png";
import lampOff from "./images/lampoff.png";
import pumpOn from "./images/pumpon.png";
import pumpOff from "./images/pumpoff.png";
import actuatorOn from "./images/actuatoron.png";
import actuatorOff from "./images/actuatoroff.png";
import add from "./images/add.png";
import remove from "./images/delete.png";

var actuatorTemplates = [
    {
        title: "Light",
        imageSrc: lampOff,
        imageAlt: "Light",
        isOn: false,
    },
    {
        title: "Water Pump",
        imageSrc: pumpOff,
        imageAlt: "Water Pump",
        isOn: false,
    },
];

const imageOptions = [
    {src: lampOff, alt: "Lamp"},
    {src: pumpOff, alt: "Pump"},
    {src: actuatorOff, alt: "Actuator"},
    // Add more image options here
];

function Actuators({isCol2Expanded}) {
    const [actuators, setActuators] = useState(actuatorTemplates);

    const toggleImage = (index) => {
        setActuators(prevActuators => {
            const updatedActuators = [...prevActuators];
            const currentImage = updatedActuators[index].imageSrc;
    
            let newImage;
            switch (currentImage) {
                case lampOff: newImage = lampOn; break;
                case lampOn: newImage = lampOff; break;
                case pumpOff: newImage = pumpOn; break;
                case pumpOn: newImage = pumpOff; break;
                case actuatorOff: newImage = actuatorOn; break;
                case actuatorOn: newImage = actuatorOff; break;
                default: newImage = currentImage;
            }
    
            updatedActuators[index] = {
                ...updatedActuators[index],
                imageSrc: newImage,
            };
    
            return updatedActuators;
        });
    };
    


    const addActuator = () => {
        const title = prompt("Enter the title for the new actuator:");
        if (title) {
            const selectedImage = prompt("Select the image for the new actuator:\n\n" +
                imageOptions.map((option, index) => `${index + 1}. ${option.alt}`).join("\n"));
            if (selectedImage) {
                const imageIndex = parseInt(selectedImage) - 1;
                if (imageIndex >= 0 && imageIndex < imageOptions.length) {
                    const ip = prompt("Enter the IP for the new actuator:");
                    if (ip) {
                        const newActuator = {
                            title: title,
                            imageSrc: imageOptions[imageIndex].src,
                            imageAlt: imageOptions[imageIndex].alt,
                            isOn: false,
                            ip: ip,
                        };
                        setActuators((prevActuators) => [...prevActuators, newActuator]);
                    } else {
                        alert("Invalid IP.");
                    }
                } else {
                    alert("Invalid image selection.");
                }
            }
        }
    };

    const deleteActuator = (index) => {
        setActuators((prevSensors) => {
            const updatedSensors = [...prevSensors];
            updatedSensors.splice(index, 1);
            return updatedSensors;
        });
    };


    return (
        <div className="actuators-container">
            <div className="actuators-row">
                {actuators.map((actuator, index) => (
                    <div className="actuator" key={index}>
                        {isCol2Expanded && (
                            <button className="delete-actuator" onClick={() => deleteActuator(index)}>
                                <img src={remove} alt="Delete" />
                            </button>
                        )}
                        <h2>{actuator.title}</h2>
                        <img src={actuator.imageSrc} alt={actuator.imageAlt} />
                        <button onClick={() => toggleImage(index)}>
                            <Button />
                        </button>
                    </div>
                ))}
                {isCol2Expanded && (
                    <div className="add-actuator">
                        <h2>Add Actuator</h2>
                        <img src={add} alt="Add Actuator" onClick={addActuator} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Actuators;