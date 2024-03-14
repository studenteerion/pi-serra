const axios = require("axios").create();
const config = require(process.env.filePath);
const light = require('./lights');
const air = require('./air');
const pump = require('./pump');
const db = require('./db')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const { isConfigUpdated } = require('./updateConfig')

const Sensors = process.env.Sensors
let datiSensori;

async function getSensorData() {
  try {
    const response = await axios({
      url: Sensors,
      method: "get",
    });

    //console.log(response.data.Sensors[0].TaskValues);

    if (!datiSensori || JSON.stringify(datiSensori.Sensors[0].TaskValues) !== JSON.stringify(response.data.Sensors[0].TaskValues) || isConfigUpdated) {
      datiSensori = response.data
      eventEmitter.emit('sensorDataChanged');
      let dbData = {"Temperature": datiSensori.Sensors[0].TaskValues[0].Value, "Humidity": datiSensori.Sensors[0].TaskValues[1].Value}

      if (dbData.Temperature <= config.onTemperature) {
        light.accendiLuce();
        air.accendiAria();
        pump.spegniPompa();
      }
      else {
        light.spegniLuce();
        air.spegniAria();
        pump.spegniPompa();
      }
    }
  } catch (err) {
    console.error(`Error in getSensorData: ${err}`);
  }

  setTimeout(getSensorData, config.sensorUpdateFrequency * 1000);
}

function getDatiSensori() {
  if (!datiSensori) {
    return { Temperature: undefined, Humidity: undefined };
  } else
    return datiSensori.Sensors[0];
}

module.exports = { getSensorData, getDatiSensori, eventEmitter }
