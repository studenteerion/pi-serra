const express = require("express");
const app = express();
const axios = require("axios").create();
const mongoose = require("mongoose");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const Sensor = require("./dbscheme");
const bodyParser = require("body-parser");
const fs = require("fs");
require('dotenv').config();

filePath = "./panel_config_files/config.json";

const Database = process.env.Database;
const Sensors = process.env.Sensors;
const config = require(filePath);
const light = require('./functions/lights');

/* const filePath = "./config_files/config.json";
const Database = "mongodb://localhost:28080/rpiSerra";
const Sensors = "http://192.168.112.54/json";
const Actuator_status = "http://192.168.112.53/json";
const Actuator_on = "http://192.168.112.53/tools?cmd=gpio%2C0%2C0";
const Actuator_off = "http://192.168.112.53/tools?cmd=gpio%2C0%2C1"; */

light.hello();


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

mongoose //connessione al database
  .connect(Database)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error}`);
  });

const server = createServer(app); // avvio server express

const io = new Server(server); // avvio server websocket

app.use(express.static("public"));
//app.set("view engine", "ejs");

//variabile globale per l'emissione dei dati in API e WS
let datiSensori;

io.of('/main-ws').on("connection", socket => {
  console.log("a user connected");
  //emissione dell'evento di update dei dati all'avvio della connessione ws
  socket.emit("updateData", datiSensori);
});

//ultima lettura nel db
app.get("/api/lastdata", async (req, res) => {
  try {
    const sensorData = await Sensor.findOne().sort({ Time: -1 });
    res.json(sensorData);
  } catch (err) {
    console.error(`errore: ${err.message}`);
  }
});

//tutte le letture del db
app.get("/api/alldata", async (req, res) => {
  try {
    const sensorData = await Sensor.find().sort({ Time: -1 });
    res.json(sensorData);
  } catch (err) {
    console.error(`errore: ${err.message}`);
  }
});

let isConfigUpdated = false

io.of('/pannello').on('connection', socket => {
  // Send the initial panel data to the client
  socket.emit('panelData', config);
  socket.on('updateConfigData', (data) => {
    config = data;
    console.log(config);
    

    fs.writeFile(filePath, JSON.stringify(config, null, 2), (err) => {
    if (err) {
    console.error("Errore durante la scrittura del file:", err);
    return;
    }
    else {
    console.log("Dati salvati correttamente nel file JSON");
    }
    });

    // Send the updated panel data to all connected clients
    io.emit('panelData', config);

    isConfigUpdated = true
  });
});

//avvio server e ascolto di richieste HTTP
server.listen(8080, () => {
  console.log("Server started at port 8080");
});


//richiesta dati ai sensori
async function getSensorData() {
  try {
    const response = await axios({
      url: Sensors,
      method: "get",
    });

    //Verifica di differenze rispetto ai dati precedenti
    //Se vero, invio evento tramite websocket

    if (!datiSensori ||
      datiSensori.Sensors[0].Temperature != response.data.Sensors[0].Temperature ||
      datiSensori.Sensors[0].Humidity != response.data.Sensors[0].Humidity || isConfigUpdated
    ) {
      io.emit("updateData", datiSensori);
      datiSensori = response.data

      try {
        const newSensorData = new Sensor(response.data.Sensors[0]);
        await newSensorData.save();
      
      } catch (err) {
        console.error(`Error trying to save to database: ${err}`);
      }

      if (datiSensori.Sensors[0].Temperature <= config.onTemperature)
        light.accendiLuce();
      else 
        light.spegniLuce();

        isConfigUpdated = false
    }
  } catch (err) {
    console.error(`Error in getSensorData: ${err}`);
  }

  setTimeout(getSensorData, config.sensorUpdateFrequency * 1000); //intervallo per richiedere i dati ai sensori
}

getSensorData(); //invocazione della funzione la prima volta in modo che i dati non siano vuoti appena di accede all'applicazione