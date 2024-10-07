import React, { useState } from 'react';
import "./AddPopup.css";

const apiKey = process.env.REACT_APP_API_KEY;
const apiUrl = process.env.REACT_APP_API_URL;


function addElement (type, name, ip) {

    let route = "";

    if (type === "Sensor") {
         route = `http://${apiUrl}:8080/sensors/`;
    } else if (type === "Actuator") {
         route = `http://${apiUrl}:8080/controls/`;
    }

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", `${apiKey}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "description": name,
        "url": ip
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(route, requestOptions)
        .then((response) => response.text())
        //.then((result) => console.log(result))
        //.catch((error) => console.error(error));


}


function AddPopup({ type, onAddSensor, onClose }) {
    const [name, setName] = useState("");
    const [ip, setIp] = useState("");

    const handleOkClick = () => {
        addElement(type, name, ip);
        onClose();
    };

    const handleCancelClick = () => {
        onClose();
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleIpChange = (e) => {
        setIp(e.target.value);
    };

    return (
        <div className={"popup"}>
            <h1>Add {type}</h1>
            <form className={"data"}>
                <label htmlFor="name">Name:</label><br/>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                /><br/>
                <label htmlFor="ip">IP Address:</label><br/>
                <input
                    type="text"
                    id="ip"
                    name="ip"
                    value={ip}
                    onChange={handleIpChange}
                />
            </form>

            <button className={"cancel"} onClick={handleCancelClick}>Cancel</button>
            <button className={"ok"} onClick={handleOkClick}>OK</button>
        </div>
    );
}

export default AddPopup;