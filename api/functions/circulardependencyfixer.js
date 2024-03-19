/* const axios = require("axios").create();
//const Sensors = require('./sensors');
const light = require('./lights');
const air = require('./air');
const pump = require('./pump');
const config = require(process.env.filePath);
const Air_status = `${process.env.Air}json`;
const Pump_status = `${process.env.Pump}json`;
const Light_status = `${process.env.Actuator}json`;
const Sensors = process.env.Sensors

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
          air.spegniAria();
          pump.spegniPompa();
        }
        else {
          light.spegniLuce();
          air.accendiAria();
          pump.spegniPompa();
        }
      }
    } catch (err) {
      console.error(`Error in getSensorData: ${err}`);
    }
  
    setTimeout(getSensorData, config.sensorUpdateFrequency * 1000);
  }


async function statoLuce() { // ottenere stato attuatore
    try {
      const response = await axios({ // risposta
        url: Light_status, // indirizzo stato sensori
        method: "get",
      });
  
      let statoLuce = response.data.Sensors[0].TaskValues[0].Value; // stato della luce 1 = spento; 0 = acceso
  
      return statoLuce;
    } catch (err) {
      console.error(`Errore nella richiesta dello stato dell'attuatore: ${err}`);
      return undefined;
    }
  }


  async function statoPompa() { // ottenere stato pompa
    try {
      const response = await axios({ // risposta
        url: Pump_status, // indirizzo stato sensori
        method: "get",
      });
  
      let statoLuce = response.data.Sensors[0].TaskValues[0].Value; // stato della pompa 1 = spento; 0 = acceso
  
      return statoLuce;
    } catch (err) {
      console.error(`Errore nella richiesta dello stato della pompa: ${err}`);
      return undefined;
    }
  }

  async function statoAria() { // ottenere stato aria
    try {
      const response = await axios({ // risposta
        url: Air_status, // indirizzo stato sensori
        method: "get",
      });
  
      let statoLuce = response.data.Sensors[0].TaskValues[0].Value; // stato dell'aria 1 = spento; 0 = acceso
  
      return statoLuce;
    } catch (err) {
      console.error(`Errore nella richiesta dello stato dell'Aria: ${err}`);
      return undefined;
    }
  }

  setTimeout(getSensorData, 1000);
  setTimeout(statoLuce, 1000);
  setTimeout(statoPompa, 1000);
  setTimeout(statoAria, 1000);

  module.exports = {getSensorData, statoLuce, statoPompa, statoAria} */