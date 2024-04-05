const axios = require("axios").create();
//const config = require(process.env.filePath);
//const light = require('./lights');
//const pump = require('./pump');
//const air = require('./air');
//const db = require('./db')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const { isConfigUpdated } = require('./updateConfig')

const getjson = require('./getjson');

const Sensors = process.env.Sensors
let datiSensori;

async function getSensorData() {
    //console.log("ping 0");
    try {

        response = await getjson.sensorJSON(Sensors);

        //console.log(response[0].TaskValues);

        if (!datiSensori || JSON.stringify(datiSensori) !== JSON.stringify(response[0].TaskValues) || isConfigUpdated) {

            //console.log("ping 1");

            //console.log(response.data.Sensors[0].TaskValues);

            datiSensori = response[0].TaskValues

            //console.log(datiSensori);

            //eventEmitter.emit('sensorDataChanged');
            let dbData = { Temperature: datiSensori[0].Value, Humidity: datiSensori[1].Value }
            //db.saveData(dbData)

            console.log(dbData);

            /* if (dbData.Temperature <= config.onTemperature) {
              light.accendiLuce();
              air.accendiAria();
              //pump.spegniPompa();
            }
            else {
              light.spegniLuce();
              air.spegniAria();
              //pump.spegniPompa();
            }
            */

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
