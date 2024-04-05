const axios = require("axios").create();

async function sensorJSON(url) {
    const response = await axios({
        url: url,
        method: "get",
    });
    
    responseSoloSensors = response.data.Sensors; //estraggo solo i dati dei sensori dal json (nella risposta c'è la proprietà "data" che contiene il json effettivo che ha risposto l'ESP)
    console.log(responseSoloSensors)
    return responseSoloSensors
}


module.exports = { sensorJSON }