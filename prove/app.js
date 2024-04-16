const express = require("express");
const app = express();
const { createServer } = require("node:http");
const manager = require("../api/functions/config_filesManager");
//const changeStatus = require("../api/functions/changestatus");
//const cors = require('cors');

//const bodyParser = require("body-parser");



require('dotenv').config();

manager.getUrlById(1);

manager.removeUrl(2);



//const db = require('./functions/db');
//const sensors = require('./sensors');
/*const socket = require('./functions/socket')

app.use(cors());

app.use(bodyParser.json());  //needed to handle http request
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
 */

//const url = process.env.Light;
//const url = `${process.env.Air}json`;
//changeStatus(url,0);


//changeStatus()

const server = createServer(app); // avvio server express




//socket.createSocket(server)
//app.use(express.static("public"));

//socket.listenForMainConnection()
//socket.listenForPanel()

//ultima lettura nel db
/* app.get("/api/lastdata", async (_, res) => {
  res.json(await db.getData(true));
});

//tutte le letture del db
app.get("/api/alldata", async (_, res) => {
  res.json(await db.getData(false));
}); */

//(async () => {
//  await db.connect();
//})().then(() => {
//avvio server e ascolto di richieste HTTP



server.listen(8080, () => {
    console.log("Server started at port 8080");
});



//});

//richiesta dati ai sensori
//invocazione della funzione la prima volta in modo che i dati non siano vuoti appena di accede all'applicazione
//sensors.getSensorData();