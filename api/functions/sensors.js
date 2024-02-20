const axios = require("axios").create();
const filePath = "../panel_config_files/config.json";
const config = require(filePath);

const Sensors =  process.env.Sensors

async function getSensorData() {
    try {
      const response = await axios({
        url: Sensors,
        method: "get",
      });
  
      //Verifica di differenze rispetto ai dati precedenti
      //Se vero, invio evento tramite websocket
  
      if (!datiSensori ||
        datiSensori.Sensors[0].Temperature != response.data.Sensors[0].Temperature ||
        datiSensori.Sensors[0].Humidity != response.data.Sensors[0].Humidity || isConfigUpdated
      ) {
        io.emit("updateData", datiSensori);
        datiSensori = response.data
        db.saveData(response.data.Sensors[0])
  
        if (datiSensori.Sensors[0].Temperature <= config.onTemperature)
          light.accendiLuce();
        else
          light.spegniLuce();
  
        isConfigUpdated = false
      }
    } catch (err) {
      console.error(`Error in getSensorData: ${err}`);
    }
  
    setTimeout(getSensorData, config.sensorUpdateFrequency * 1000); //intervallo per richiedere i dati ai sensori
  }

module.exports = { getSensorData }