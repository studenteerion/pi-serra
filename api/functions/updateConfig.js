const filePath = "../panel_config_files/config.json";
const config = require(filePath);

function getConfig(){
    return config;
}

function saveConfig(updatedConfigData) {
    fs.writeFile(filePath, JSON.stringify(updatedConfigData, null, 2), (err) => {
        if (err) {
          console.error("Errore durante la scrittura del file:", err);
          return;
        }
        else {
          console.log("Dati salvati correttamente nel file JSON");
        }
      });  
}

module.exports = { saveConfig, getConfig }