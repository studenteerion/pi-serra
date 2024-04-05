const express = require("express")
const bodyParser = require("body-parser")
  
const app = express();
const { createServer } = require("node:http");
const cors = require('cors');

require('dotenv').config();

const db = require('./functions/db');
const swagger = require('./swagger').default

app.use(cors());

app.use(bodyParser.json());  //needed to handle http request
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const server = createServer(app); // avvio server express
app.use(express.static("public"));
swagger(app)

//ultima lettura nel db
app.get("/api/lastdata", async (_, res) => {
  res.json(await db.getData(true));
});

//tutte le letture del db
app.get("/api/alldata", async (_, res) => {
  res.json(await db.getData(false));
});

(async () => {
  // await db.connect();
})().then(() => {
  //avvio server e ascolto di richieste HTTP
  server.listen(8080, () => {
    console.log("Server started at port 8080");
  });

});

