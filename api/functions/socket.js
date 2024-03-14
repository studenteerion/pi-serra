const { Server } = require("socket.io");
const sensors = require('./sensors')
const display = require('./display'); //module to write to the display
let config = require(process.env.filePath);
const configFile = require('./updateConfig');

let isConfigUpdated = false
let io;

function createSocket(server) { //create the websocket function
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
}

function listenForMainConnection() { //send data when the first connection happens
    io.of('/main-ws').on("connection", socket => {
        console.log("a user connected");
        socket.emit("updateData", sensors.getDatiSensori())
    });

    display.scrivi();

    console.log("called listenForMainConnection in socket module");
}

function sendSensorData() { //send data to the main webpage
    io.of('./main-ws').emit("updateData", sensors.getDatiSensori())

    display.scrivi();

    console.log("called sendSensorData in socket module");
}

function listenForPanel() { //listens for a connection to the panel and updates the config data
    io.of('/pannello').on('connection', socket => {
        console.log('a panel connected');
        updatePanelData()
        socket.on('updateConfigData', (data) => {
            config = data;
            console.log(config);
            configFile.saveConfig(config)
            updatePanelData()

            isConfigUpdated = true
        });
    });
}

function updatePanelData() {
    io.of('/pannello').emit('panelData', config);
}

sensors.eventEmitter.on('sensorDataChanged', sendSensorData);

module.exports = { createSocket, listenForMainConnection, sendSensorData, listenForPanel };
