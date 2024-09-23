import React, { useState } from 'react';
import './Button.css';

const Button = ({ id }) => {
    const [status, setStatus] = useState(1);

    function handleTestAccendi() {
        const newStatus = status === 1 ? 0 : 1;

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", "9mns924xqak1nkqmkjnpas01742bsino");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("ngrok-skip-browser-warning", "69420");

        const raw = JSON.stringify({
            "status": newStatus.toString()
        });

        console.log(raw);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`https://generally-enormous-snapper.ngrok-free.app/controls/${id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        setStatus(newStatus);
    }

    return (
        <div className="Actuators-container">
            <button onClick={handleTestAccendi}>On/Off</button>
        </div>
    );
};

export default Button;
