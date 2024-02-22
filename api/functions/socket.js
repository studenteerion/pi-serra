const { Server } = require("socket.io");
const sensors = require('./sensors')

let isConfigUpdated = false
let io;

function createSocket(server) {
    io = new Server(server);
}

function listenForMainConnection() {
    io.of('/main-ws').on("connection", socket => {
        console.log("a user connected");
        sendSensorData()
      });
}

function sendSensorData() {
    io.emit("updateData", sensors.datiSensori)
}

function listenForPanel() {
    io.of('/pannello').on('connection', socket => {
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
    socket.emit('panelData', config);
}

sensors.eventEmitter.on('sensorDataChanged', sendSensorData);

module.exports = {createSocket, listenForMainConnection, sendSensorData, listenForPanel}
