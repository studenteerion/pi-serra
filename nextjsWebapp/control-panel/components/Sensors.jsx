import React from 'react';
// { useState, useEffect } from "react";
import styles from "./Actuators.module.css";
import Button from "./Button";
import lampOn from "@/images/lampon.png";
import lampOff from "@/images/lampoff.png";
import { set } from "mongoose";

/* var actuatorTemplates = [
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
]; */

async function fetchHumidityAndTemperature() {
    try {
        //const response = await fetch("http://example.com/api/humidity-temperature");
        const res = await fetch("https://api.sampleapis.com/beers/ale", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
            {cache : "no-store"},
        );
        if (!res.ok) return console.log("Failed to Fetch") //if the response is not ok, return a 404 error
        return res.json()
    } catch (error) {
        console.error(error);
    }
}

const  Sensors = async ()=> {
    //const [actuators, setActuators] = useState(actuatorTemplates);
    //const [humidity, setHumidity] = useState(null);
    //const [temperature, setTemperature] = useState(null);
    const data = await fetchHumidityAndTemperature();
        //const interval = setInterval(() => {
            // Call the fetchHumidityAndTemperature function
            fetchHumidityAndTemperature()
                .then((data) => {
                    //setHumidity(data.name);
                    //setTemperature(data.price);
                    //setHumidity(data.humidity);
                    //setTemperature(data.temperature);
                })
                .catch((error) => {
                    console.error(error);
                });
        //}, 1000);
        //return () => clearInterval(interval); // Clean up the interval on component unmount

/*     const toggleImage = (index) => {
        setActuators((prevActuators) => {
            const updatedActuators = [...prevActuators];
            updatedActuators[index] = {
                ...updatedActuators[index],
                imageSrc: updatedActuators[index].imageSrc === lampOff ? lampOn : lampOff,
            };
            return updatedActuators;
        });
    }; */

    return (
        <div>
            <h2>Humidity: {}</h2>
            <h2>Temperature: {}</h2>
            {data.map((actuator) => (
                <div className="actuators" key={actuator.name}>
                        <h2>{actuator.name}</h2>
                    <img src={actuator.imageSrc} alt={actuator.price} />
                    <button>
                       {/*  <Button /> */}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Sensors;
