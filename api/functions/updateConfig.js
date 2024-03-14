const fs = require("fs");

let isConfigUpdated = false;

function getConfig() {
  return config;
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

module.exports = { saveConfig, getConfig, isConfigUpdated };