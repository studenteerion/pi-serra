import React, { useState, useEffect } from "react";
import "./Sensors.css";
import thermometer from "./images/thermometer.png";
import humidity from "./images/humidity.png";
import add from "./images/add.png";
import sensor from "./images/sensor.png";
import remove from "./images/delete.png";
import AddPopup from "./AddPopup";

const RASPBERRYADDRESS = "generally-enormous-snapper.ngrok-free.app";

// Template di esempio per i sensori
const sensorTemplates = [
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

// Opzioni di immagine per i sensori
const imageOptions = [
  { src: thermometer, alt: "Thermometer" },
  { src: humidity, alt: "Humidity" },
  { src: sensor, alt: "Sensor" },
  // Aggiungi ulteriori opzioni di immagine qui
];

// Funzione asincrona per richiedere i dati dei sensori
async function requestSensorsData(ipServer) {
  try {
    // Effettua la richiesta API e attendi il suo completamento
    const response = await fetch(`http://${ipServer}/sensors`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "X-API-KEY": "9mns924xqak1nkqmkjnpas01742bsino",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    // Controlla se la risposta è valida
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parsecella risposta come JSON
    let data = await response.json();

    // Toggle per la modalità simulazione
    let simulationmode = true;

    if (simulationmode) {
      let exampleAPIAns = [
        {
          id: 1,
          description: "Sensore DHT22",
          values: [
            {
              ValueNumber: 1,
              Name: "Temperature",
              NrDecimals: 0,
              Value: 36,
            },
            {
              ValueNumber: 2,
              Name: "Humidity",
              NrDecimals: 0,
              Value: 35,
            },
          ],
        },
      ];

      data = exampleAPIAns;
    }

    console.log(data); // Log dei dati ricevuti dall'API

    // Inizializza l'array per contenere i dati formattati dei sensori
    let sensorsDataFormatted = [];

    // Indice per i sensori
    let indexSensor = 0;

    // Itera su ogni oggetto sensore nell'array dei dati
    data.forEach(function (sensor) {
      console.log(sensor.description);

      // Itera su ogni valore nell'array dei valori del sensore
      sensor.values.forEach(function (value) {
        sensorsDataFormatted[indexSensor] = {}; // Inizializza l'oggetto

        sensorsDataFormatted[indexSensor].title = value.Name;

        // Assegna le immagini appropriate basandosi sul nome del valore
        if (value.Name === "Temperature") {
          sensorsDataFormatted[indexSensor].imageSrc = thermometer;
          sensorsDataFormatted[indexSensor].imageAlt = "Temperature";
        } else if (value.Name === "Humidity") {
          sensorsDataFormatted[indexSensor].imageSrc = humidity;
          sensorsDataFormatted[indexSensor].imageAlt = "Humidity";
        } else {
          sensorsDataFormatted[indexSensor].imageSrc = sensor;
          sensorsDataFormatted[indexSensor].imageAlt = "Sensor";
        }

        // Assegna altre proprietà
        sensorsDataFormatted[indexSensor].isOn = false;
        sensorsDataFormatted[indexSensor].value = value.Value;

        console.log("title: " + value.Name);
        console.log("value: " + value.Value);

        // Incrementa l'indice del sensore
        indexSensor++;
      });

      console.log(sensor.description);
    });

    // Ritorna i dati dei sensori formattati
    return sensorsDataFormatted;
  } catch (error) {
    // Log degli errori che occorrono durante il fetch o il processing
    console.error("Error:", error);
    return [];
  }
}

function Sensors({ isCol1Expanded }) {
  // Stato per gestire i dati dei sensori
  const [sensors, setSensors] = useState([]);

  // Stato per gestire la visibilità del popup
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Effettua il fetch dei dati quando il componente si monta e ogni 10 secondi
  useEffect(() => {
    // Funzione asincrona per il fetch dei dati
    const fetchSensors = async () => {
      const sensorData = await requestSensorsData(RASPBERRYADDRESS);
      setSensors(sensorData); // Aggiorna lo stato con i dati ricevuti
    };

    fetchSensors(); // Effettua il fetch iniziale

    const interval = setInterval(fetchSensors, 10000); // Imposta l'intervallo di 10 secondi

    // Pulisce l'intervallo quando il componente si smonta
    return () => clearInterval(interval);
  }, []); // Array vuoto significa che l'effetto si esegue una volta al montaggio

  const addSensor = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const deleteSensor = (index, id) => {
    let ip = "192.168.1.5";

    setSensors((prevSensors) => {
      const updatedSensors = [...prevSensors];
      updatedSensors.splice(index, 1);
      return updatedSensors;
    });

    fetch(`http://${ip}:8080/sensors/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "X-API-KEY": "9mns924xqak1nkqmkjnpas01742bsino",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="sensors-container">
      <div className="sensors-row">
        {sensors.map((sensor, index) => (
          <div className="sensor" key={index}>
            {isCol1Expanded && (
              <button
                className="delete-sensor"
                onClick={() => deleteSensor(index, sensor.id)}
              >
                <img src={remove} alt="Delete" />
              </button>
            )}
            <h2>{sensor.title}</h2>
            <img src={sensor.imageSrc} alt={sensor.imageAlt} />
            <h2>{sensor.value}</h2>
          </div>
        ))}
        {isCol1Expanded && (
          <>
            <div className="add-sensor">
              <h2>Add Sensor</h2>
              <img src={add} alt="Add Sensor" onClick={addSensor} />
            </div>
            {isPopupVisible && (
              <div className="popup">
                <AddPopup type={"Sensor"} onClose={closePopup} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Sensors;
