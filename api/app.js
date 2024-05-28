const express = require("express")
const bodyParser = require("body-parser")

const app = express();
const { createServer } = require("node:http");
const cors = require('cors');
require('dotenv').config();
console.log(process.env.Database);

const db = require('./functions/db');
const SensorValues = require('./functions/db_dyn_schema')
const swagger = require('./swagger')
const getJson = require('./functions/getjson')
const sensorList = require('./config_files/sensors_list.json')

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

//impostazione delle routes
app.use('/sensors', require('./routes/sensors'));
app.use('/controls', require('./routes/controls'));

(async () => {
  await db.connect();
})().then(() => {
  //avvio server e ascolto di richieste HTTP
  server.listen(8080, () => {
    console.log("Server started at port 8080");
  });

  //polling di tutti sensori da eseguire periodicamente
  setInterval(async () => {
    try {
      const dataPromises = sensorList.map(device => processDevice(device));
      const allData = await Promise.all(dataPromises);

      // Assuming `Data` is your Mongoose model
      const data = new SensorValues({ valueList: [].concat(...allData.map(data => data.valueList)) });
      console.log(data);
      await data.save();

      console.log(`All data saved successfully.`);

    } catch (error) {
      console.error(`Error processing devices: ${error}`);
    }
  }, process.env.UpdateFrequencySeconds * 1000)

});

async function processDevice(device) {
  try {
    const taskValues = await getJson.sensorJSON(device.url);
    const transformedData = transformData(taskValues);

    console.log(`Data for device ${device.id} fetched successfully.`);
    return transformedData;

  } catch (error) {
    console.error(`Error processing device ${device.id}: ${error}`);
  }
}

function transformData(taskValues) {
  return {
    date: new Date(),
    valueList: taskValues.map(taskValue => ({
      description: taskValue.Name,
      value: taskValue.Value.toString()
    }))
  };
}
