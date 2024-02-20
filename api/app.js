const express = require("express");
const app = express();
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const fs = require("fs");
require('dotenv').config();


const light = require('./functions/lights');
const db = require('./functions/db');
const sensors = require('./functions/sensors');
const configFile = require('./functions/updateConfig');
const config = configFile.getConfig();

app.use(bodyParser.json());  //needed to handle http request
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const server = createServer(app); // avvio server express
const io = new Server(server); // avvio server websocket

app.use(express.static("public"));

//variabile globale per l'emissione dei dati in API e WS
let datiSensori;

io.of('/main-ws').on("connection", socket => {
  console.log("a user connected");
  //emissione dell'evento di update dei dati all'avvio della connessione ws
  socket.emit("updateData", datiSensori);
});

//ultima lettura nel db
app.get("/api/lastdata", async (req, res) => {
  res.json(db.getData(true));
});

//tutte le letture del db
app.get("/api/alldata", async (req, res) => {
  res.json(db.getData(false));
});

let isConfigUpdated = false

io.of('/pannello').on('connection', socket => {
  // Send the initial panel data to the client
  socket.emit('panelData', config);
  socket.on('updateConfigData', (data) => {
    config = data;
    console.log(config);
    configFile.saveConfig(config)

    /* fs.writeFile(filePath, JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.error("Errore durante la scrittura del file:", err);
        return;
      }
      else {
        console.log("Dati salvati correttamente nel file JSON");
      }
    });
 */
    // Send the updated panel data to all connected clients
    io.emit('panelData', config);

    isConfigUpdated = true
  });
});

(async () => {
  await db.connect();
})().then(() => {
  //avvio server e ascolto di richieste HTTP
  server.listen(8080, () => {
    console.log("Server started at port 8080");
  });

});

//richiesta dati ai sensori
//invocazione della funzione la prima volta in modo che i dati non siano vuoti appena di accede all'applicazione
sensors.getSensorData();