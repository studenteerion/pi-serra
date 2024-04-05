const axios = require("axios").create();

async function sensorJSON(url) {
    const response = await axios({
        url: url,
        method: "get",
    });

    responseSoloSensors = response.data.Sensors; //estraggo solo i dati dei sensori dal json (nella risposta c'è la proprietà "data" che contiene il json effettivo che ha risposto l'ESP)
    //console.log(responseSoloSensors)
    return responseSoloSensors
}


async function allSensorsJSON(urls) {

    let JsonTutto = []; // json dove sommo tutte le risposte dei sensori


    for (let i = 0; i < urls.length; i++) {
        console.log("Obtaining " + urls[i]);
        const response = await axios({
            url: urls[i],
            method: "get",
        });

        JsonTutto[i] = response.data.Sensors; // sommo il json ricevuto nel json unificato
    }

    console.log(JsonTutto);
    return JsonTutto;
}


module.exports = { sensorJSON, allSensorsJSON }