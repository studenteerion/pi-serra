const axios = require("axios").create();
const config = require(process.env.filePath);
const light = require('./lights');
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

    if (!datiSensori || JSON.stringify(datiSensori) !== JSON.stringify(response.data.Sensors[0].TaskValues) || isConfigUpdated) {
      datiSensori = response.data.Sensors[0].TaskValues
      eventEmitter.emit('sensorDataChanged');
      let dbData = {Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value}
      db.saveData(dbData)

      if (datiSensori[0].Value <= config.onTemperature)
        light.accendiLuce();
      else
        light.spegniLuce();
    }
  } catch (err) {
    console.error(`Error in getSensorData: ${err}`);
  }

  setTimeout(getSensorData, config.sensorUpdateFrequency * 1000);
}

function getDatiSensori() {
  if (!datiSensori) {
    return {Temperature: undefined, Humidity: undefined};
  } else
    return datiSensori;
}

module.exports = { getSensorData, getDatiSensori, eventEmitter }
