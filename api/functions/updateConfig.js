const fs = require("fs");

let isConfigUpdated = false;

/* async function getConfig() {
  fs.readFile('./panel_config_files/config.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    //console.log(data);
    let dataToReturn = data;
  });
  return dataToReturn
} */

function getConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile('./panel_config_files/config.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}


function saveConfig(updatedConfigData) {
  fs.writeFile('./panel_config_files/config.json', JSON.stringify(updatedConfigData, null, 2), (err) => {
    if (err) {
      console.error("Errore durante la scrittura del file:", err);
      return;
    }
    else {
      console.log("Dati salvati correttamente nel file JSON");
      isConfigUpdated = true
    }
  });
}


function updated() {
  return isConfigUpdated;
}

function update(status) {
  isConfigUpdated = status;
}

module.exports = { saveConfig, getConfig, updated, update };