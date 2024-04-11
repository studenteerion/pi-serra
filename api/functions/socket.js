const { Server } = require("socket.io");
const sensors = require('./sensors')
const display = require('./display')
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
    const data = sensors.getDatiSensori();

    const dataPromise = Promise.resolve(data);

    dataPromise.then((data) => {
        const temperatura = data.Temperature;
        const umidita = data.Humidity;

        io.of('/main-ws').on("connection", socket => {
            console.log("a user connected");
            socket.emit("updateData", { Temperature: temperatura, Humidity: umidita })
        });

        display.scrivi({ Temperature: temperatura, Humidity: umidita });

    });
}

function sendSensorData() {
    const data = sensors.getDatiSensori();

    const dataPromise = Promise.resolve(data);

    dataPromise.then((data) => {
        const temperatura = data.Temperature;
        const umidita = data.Humidity;

        console.log(temperatura);
        console.log(umidita);

        display.scrivi({ Temperature: temperatura, Humidity: umidita });

        sensors.getSensorData();

        io.of('/main-ws').emit('updateData', { Temperature: temperatura, Humidity: umidita });
    });
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

module.exports = { createSocket, listenForMainConnection, sendSensorData, listenForPanel };
