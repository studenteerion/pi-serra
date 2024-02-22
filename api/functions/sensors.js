const axios = require("axios").create();
const config = require(process.env.filePath);
const light = require('./lights');
const db = require('./db')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const {isConfigUpdated} = require('./updateConfig')

const Sensors =  process.env.Sensors
let datiSensori;

async function getSensorData() {
    try {
      const response = await axios({
        url: Sensors,
        method: "get",
      });
  
      if (!datiSensori || JSON.stringify(datiSensori.Sensors[0]) !== JSON.stringify(response.data.Sensors[0]) || isConfigUpdated) {
        eventEmitter.emit('sensorDataChanged');
        datiSensori = response.data
        db.saveData(response.data.Sensors[0])
  
        if (datiSensori.Sensors[0].Temperature <= config.onTemperature)
          light.accendiLuce();
        else
          light.spegniLuce();
      }
    } catch (err) {
      console.error(`Error in getSensorData: ${err}`);
    }
  
    setTimeout(getSensorData, config.sensorUpdateFrequency * 1000);
}

module.exports = { getSensorData, datiSensori, eventEmitter }
