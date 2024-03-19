const { Server } = require("socket.io");
const sensors = require('./sensors')
let config = require(process.env.filePath);
const configFile = require('./updateConfig')

let isConfigUpdated = false
let io;

function createSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
}

function listenForMainConnection() {
    io.of('/main-ws').on("connection", socket => {
        console.log("a user connected");
        socket.emit("updateData", sensors.getDatiSensori())
    });
}

function sendSensorData() {
    io.of('./main-ws').emit("updateData", sensors.getDatiSensori())
}

function listenForPanel() {
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

module.exports = { createSocket, listenForMainConnection, sendSensorData, listenForPanel }
