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
import AddPopup from "./AddPopup";

var actuatorTemplates = [
    {
        title: "Light",
        imageSrc: lampOff,
        imageAlt: "Light",
        isOn: false,
        id: "a1736624-0f33-4c20-a04e-e8a6a059d2c4",
    },
    {
        title: "Water Pump",
        imageSrc: pumpOff,
        imageAlt: "Water Pump",
        isOn: false,
        id: "d074cada-9be2-4749-90ae-1271f0a27fcc",
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

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const addActuator = () => {
        setIsPopupVisible(true);
    }

    const closePopup = () => {
        setIsPopupVisible(false);
    }

    const toggleImage = (index) => {
        setActuators(prevActuators => {
            const updatedActuators = [...prevActuators];
            const currentImage = updatedActuators[index].imageSrc;

            let newImage;
            switch (currentImage) {
                case lampOff:
                    newImage = lampOn;
                    break;
                case lampOn:
                    newImage = lampOff;
                    break;
                case pumpOff:
                    newImage = pumpOn;
                    break;
                case pumpOn:
                    newImage = pumpOff;
                    break;
                case actuatorOff:
                    newImage = actuatorOn;
                    break;
                case actuatorOn:
                    newImage = actuatorOff;
                    break;
                default:
                    newImage = currentImage;
            }

            updatedActuators[index] = {
                ...updatedActuators[index],
                imageSrc: newImage,
            };

            return updatedActuators;
        });
    };


    /*const addActuator = () => {
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
    };*/

    const deleteActuator = (index, id) => {
        setActuators((prevSensors) => {
            const updatedSensors = [...prevSensors];
            updatedSensors.splice(index, 1);
            return updatedSensors;
        });

        fetch(`http://192.168.103.51:8080/controls/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'X-API-KEY': '9mns924xqak1nkqmkjnpas01742bsino'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

    };


    return (
        <div className="actuators-container">
            <div className="actuators-row">
                {actuators.map((actuator, index) => (
                    <div className="actuator" key={index}>
                        {isCol2Expanded && (
                            <button className="delete-actuator" onClick={() => deleteActuator(index, actuator.id)}>
                                <img src={remove} alt="Delete"/>
                            </button>
                        )}
                        <h2>{actuator.title}</h2>
                        <img src={actuator.imageSrc} alt={actuator.imageAlt}/>
                        <button onClick={() => toggleImage(index)}>
                            <Button id={actuator.id}/>
                        </button>
                    </div>
                ))}
                {isCol2Expanded && (
                    <>
                        <div className="add-actuator">
                            <h2>Add Actuator</h2>
                            <img src={add} alt="Add Actuator" onClick={addActuator}/>
                        </div>

                        {isPopupVisible && (
                            <div className="popup">
                                <AddPopup type={"Actuator"} onClose={closePopup}/>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Actuators;