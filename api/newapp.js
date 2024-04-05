const express = require("express")
const bodyParser = require("body-parser")
  
const app = express();
const { createServer } = require("node:http");
const cors = require('cors');

require('dotenv').config();

const db = require('./functions/db');
const swagger = require('./swagger')

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

app.use('/api', require('./routes/api'));

(async () => {
  // await db.connect();
})().then(() => {
  //avvio server e ascolto di richieste HTTP
  server.listen(8080, () => {
    console.log("Server started at port 8080");
  });

});

