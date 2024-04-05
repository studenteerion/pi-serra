const express = require("express");
const app = express();
const { createServer } = require("node:http");
//const cors = require('cors');

//const bodyParser = require("body-parser");
require('dotenv').config();

//const db = require('./functions/db');
const getjson = require('./getjson.js');
//const socket = require('./functions/socket')

//app.use(cors());

/* app.use(bodyParser.json());  //needed to handle http request
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
); */

const server = createServer(app); // avvio server express
//socket.createSocket(server)
app.use(express.static("public"));

getjson.sensorJSON(`${process.env.Sensors}json`);


//socket.listenForMainConnection()
//socket.listenForPanel()

/* //ultima lettura nel db
app.get("/api/lastdata", async (req, res) => {
  res.json(await db.getData(true));
}); */

/* //tutte le letture del db
app.get("/api/alldata", async (req, res) => {
  res.json(await db.getData(false));
}); */

//(async () => {
 // await db.connect();
//})().then(() => {
  //avvio server e ascolto di richieste HTTP
  server.listen(8080, () => {
    console.log("Server started at port 8080");
  });

//});

//richiesta dati ai sensori
//invocazione della funzione la prima volta in modo che i dati non siano vuoti appena di accede all'applicazione
//sensors.getSensorData();