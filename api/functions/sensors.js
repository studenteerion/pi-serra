//const axios = require("axios").create();
const config = require(process.env.filePath);
const light = require('./lights');
const pump = require('./pump');
const air = require('./air');
const db = require('./db')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const updated = require('./update_config')


const getjson = require('./getjson');

const Sensors = process.env.Sensors
let datiSensori;

async function getSensorData() {

  let ontemperature = await updated.getConfig();
  //console.log(ontemperature.onTemperature);

  update = updated.updated();
    //console.log("ping 0");
    try {
        response = await getjson.sensorJSON(Sensors);
        //console.log(response[0].TaskValues);

        if (!datiSensori || JSON.stringify(datiSensori) !== JSON.stringify(response[0].TaskValues) || update) {

            //console.log("ping 1");

            //console.log(response.data.Sensors[0].TaskValues);

            datiSensori = response[0].TaskValues

            //console.log(datiSensori);

            //console.log(`before = ${updated.updated()}`);

            updated.update(false);

            //console.log(`after = ${updated.updated()}`);

            eventEmitter.emit('sensorDataChanged');
            
            let dbData = { Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value }
            
            db.saveData(dbData)

            console.log(dbData);

            //console.log(`temperatura:::::${ontemperature.onTemperature}`);

            if (dbData.Temperature <= ontemperature.onTemperature) {
                console.log("Temperature is below config.onTemperature");
                light.accendiLuce();
                air.accendiAria();
                pump.accendiPompa();
            }
            else {
                console.log("Temperature is above config.onTemperature");
                light.spegniLuce();
                air.spegniAria();
                pump.spegniPompa();
            }

        }
    } catch (err) {
        console.error(`Error in getSensorData: ${err}`);
    }

    setTimeout(getSensorData, 1 * 1000);
}

async function getDatiSensori() {

    //console.log(datiSensori);
    //console.log({ Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value });

    if (!datiSensori) {
        return { Temperature: undefined, Humidity: undefined };
    } else {
        return { Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value };
    }

}

module.exports = { getSensorData, getDatiSensori, eventEmitter }






/* const axios = require("axios").create();
const config = require(process.env.filePath);
const light = require('./lights');
//const pump = require('./pump');
//const air = require('./air');
const db = require('./db')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const { isConfigUpdated } = require('./updateConfig')

const getjson = require('./getjson');

const Sensors = process.env.Sensors
let datiSensori;

async function getSensorData() {
  console.log("ping 0");
  try {

    response = getjson.sensorJSON(Sensors)

    if (!datiSensori || JSON.stringify(datiSensori) !== JSON.stringify(response[0].TaskValues) || isConfigUpdated) {

      console.log("ping 1");

      //console.log(response.data.Sensors[0].TaskValues);

      datiSensori = response.data.Sensors[0].TaskValues
      eventEmitter.emit('sensorDataChanged');
      let dbData = { Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value }
      db.saveData(dbData)

      if (dbData.Temperature <= config.onTemperature) {
        light.accendiLuce();
        air.accendiAria();
        //pump.spegniPompa();
      }
      else {
        light.spegniLuce();
        air.spegniAria();
        //pump.spegniPompa();
      }

    }
  } catch (err) {
    console.error(`Error in getSensorData: ${err}`);
  }

  setTimeout(getSensorData, config.sensorUpdateFrequency * 1000);
}

async function getDatiSensori() {

  //console.log(datiSensori);
  //console.log({ Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value });

  if (!datiSensori) {
    return { Temperature: undefined , Humidity: undefined };
  } else{
    return { Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value };
  }

}

module.exports = { getSensorData, getDatiSensori, eventEmitter }
 */