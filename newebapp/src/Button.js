import {useState} from 'react';
import './Button.css';

const Button = ({title, value, progress, color}) => {

    async function checkStatus(id) {
        console.log("checkStatus");

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", "9mns924xqak1nkqmkjnpas01742bsino");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`http://localhost:8080/${id}`, requestOptions);
            const data = await response.json();
            console.log(data.values[0].Value);
            return data.values[0].Value; // Return the value
        } catch (error) {
            console.error(error);
            throw error; // Throw the error to be caught by the caller
        }
    }

    async function handleTestAccendi() {
        console.log("Accendi/Spegni");

        try {
            //Moodifico status attuatore a1736624-0f33-4c20-a04e-e8a6a059d2c4
            let risposta = await checkStatus("controls/a1736624-0f33-4c20-a04e-e8a6a059d2c4");

            const myHeaders = new Headers();

            //Aggiungo chiave API e tipo di contenuto
            myHeaders.append("x-api-key", "9mns924xqak1nkqmkjnpas01742bsino");
            myHeaders.append("Content-Type", "application/json");

            let status = risposta   == "0" ? "1" : "0";

            console.log(status)

            const raw = JSON.stringify({
                "status": `${status}`
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            const response = await fetch("http://localhost:8080/controls/a1736624-0f33-4c20-a04e-e8a6a059d2c4", requestOptions);
            //Status del sensore
            const result = await response.text();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="Actuators-container">
            <button onClick={handleTestAccendi}>Accendi/Spegni</button>
        </div>
    );
};

export default Button;