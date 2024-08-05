import React, { useState, useEffect } from "react";
import "./Sensors.css";
import thermometer from "./images/thermometer.png";
import humidity from "./images/humidity.png";
import add from "./images/add.png";
import sensor from "./images/sensor.png";
import remove from "./images/delete.png";
import AddPopup from "./AddPopup";

const RASPBERRYADDRESS = "generally-enormous-snapper.ngrok-free.app";

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

const imageOptions = [
  { src: thermometer, alt: "Thermometer" },
  { src: humidity, alt: "Humidity" },
  { src: sensor, alt: "Sensor" },
  // Add more image options here
];

// Define the function as async to enable use of await
async function requestSensorsData(ipServer) {
  try {
    // Make the API request and await its completion
    const response = await fetch(`http://${ipServer}/sensors`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "X-API-KEY": "9mns924xqak1nkqmkjnpas01742bsino",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response as JSON
    let data = await response.json();

    // Toggle simulation mode as needed
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
              Value: 35,
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

    console.log(data); // Log the data received from the API to the console

    // Initialize the array to hold formatted sensor data
    let sensorsDataFormatted = [];

    // Initialize the index for sensors
    let indexSensor = 0;

    // Iterate over each sensor object in the data array
    data.forEach(function (sensor) {
      console.log(sensor.description);

      // Iterate over each value object in the values array of the sensor
      sensor.values.forEach(function (value) {
        sensorsDataFormatted[indexSensor] = {}; // Initialize the object

        sensorsDataFormatted[indexSensor].title = value.Name;

        // Assign appropriate images based on the value name
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

        // Assign other properties
        sensorsDataFormatted[indexSensor].isOn = false;
        sensorsDataFormatted[indexSensor].value = value.Value;

        console.log("title: " + value.Name);
        console.log("value: " + value.Value);

        // Increment the sensor index
        indexSensor++;
      });

      console.log(sensor.description);
    });

    // Return the formatted sensor data
    return sensorsDataFormatted;
  } catch (error) {
    // Log any errors that occur during the fetch or processing
    console.error("Error:", error);
    return [];
  }
}

function Sensors({ isCol1Expanded }) {
  // Use state to manage sensors data
  const [sensors, setSensors] = useState([]);

  // Use state to manage the popup visibility
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Use effect to fetch data when the component mounts
  useEffect(() => {
    // Define an async function to fetch the sensors data
    const fetchSensors = async () => {
      const sensorData = await requestSensorsData(RASPBERRYADDRESS);
      setSensors(sensorData); // Set the fetched data to state
    };

    fetchSensors(); // Call the async function
  }, []); // Empty dependency array means this runs once on component mount

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
