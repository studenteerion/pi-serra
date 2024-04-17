const express = require("express")
const bodyParser = require("body-parser")
  
const app = express();
const { createServer } = require("node:http");
const cors = require('cors');

require('dotenv').config();

const db = require('./functions/db');
const swagger = require('./swagger')
const socket = require('./functions/socket')

app.use(cors());

app.use(bodyParser.json());  //needed to handle http request
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const server = createServer(app); // avvio server express
app.use(express.static("public"));
socket.createSocket(server)
swagger(app)

//impostazione delle routes
app.use('/sensors', require('./routes/sensors'));
app.use('/controls', require('./routes/controls'));

(async () => {
  // await db.connect();
})().then(() => {
  //avvio server e ascolto di richieste HTTP
  server.listen(8080, () => {
    console.log("Server started at port 8080");
  });

  //polling di tutti sensori da eseguire periodicamente
  //se sono rilevate differenze, vengono mandati gli update tramite il socket
  setInterval(()=>{

  }, 20000)

});

