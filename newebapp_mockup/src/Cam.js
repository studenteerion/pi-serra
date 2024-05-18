import React, { useState } from 'react';
import './Cam.css';
import cam1 from "./images/cam1.jpg";
import cam2 from "./images/cam2.jpg";
import cam3 from "./images/cam3.jpg";
import cam4 from "./images/cam4.jpg";
import cam5 from "./images/cam5.jpg";
import cam6 from "./images/cam6.jpg";

let indice = 2;

let camere = [cam1,cam2, cam3, cam4, cam5, cam6];

function Cam({ index }) {
    const [selectedCam, setSelectedCam] = useState(cam1); // Set the initial selected camera
    const [cameras, setCameras] = useState([cam1, cam2]); // Maintain a list of cameras

    const handleCameraChange = (event) => {
        const selectedCamera = event.target.value;
        if (selectedCamera === "addCamera") {
            handleAddCamera(); // Call the handleAddCamera function
        } else {
            setSelectedCam(selectedCamera);
        }
    };

    const handleAddCamera = () => {
        const streamIP = prompt("Please enter the IP of the stream:"); // Prompt the user for the IP of the stream
        if (streamIP) {
            const newCamera = camere[indice]; // Create the URL for the new camera
            indice++;
            setCameras([...cameras, newCamera]); // Add the new camera to the list of cameras
            setSelectedCam(newCamera); // Set the selected camera to the newly added camera
        }
    };


    /*const handleAddCamera = () => {
        const streamIP = prompt("Please enter the IP of the stream:"); // Prompt the user for the IP of the stream
        if (streamIP) {
            const newCamera = `http://${streamIP}/stream`; // Create the URL for the new camera
            setCameras([...cameras, newCamera]); // Add the new camera to the list of cameras
            setSelectedCam(newCamera); // Set the selected camera to the newly added camera
        }
    };*/

    return (
        <div className="stream">
            <div>
                <select value={selectedCam} onChange={handleCameraChange}>
                    {cameras.map((camera, index) => (
                        <option key={index} value={camera}>Camera {index + 1}</option>
                    ))}
                    <option value="addCamera">Add a Camera</option>
                    {/* Add the new option */}
                </select>

                <img className="img" src={selectedCam} alt="video stream"></img>

                {/*<div className="buttons1">
                    <button key={index} className="button"></button>
                    <button key={index} className="button"></button>
                </div>
                <div className="buttons2">
                    <button key={index} className="button"></button>
                    <button key={index} className="button"></button>
                </div>
                <div className="buttons3">
                    <button key={index} className="button"></button>
                    <button key={index} className="button"></button>
                </div>*/}
            </div>
        </div>
    );
}

export default Cam;
