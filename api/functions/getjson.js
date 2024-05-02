const axios = require("axios").create();

async function sensorJSON(url) {
    try {
    //console.log(`${url}/json`);
    const response = await axios({
        url: `${url}/json`,
        method: "get",
    });

    return response.data.Sensors;
    
    } catch (error) {
        console.error(`Errore nel richiedere il json del sensore ${url}: ${error}`);
        return `Errore nel richiedere il json del sensore ${url}: ${error}`;
    }
}

async function allSensorsJSON(urls) {
    const jsonTutto = [];
    for (const url of urls) {
        try {
            const response = await axios.get(`${url}/json`);
            jsonTutto.push(response.data.Sensors);
        } catch (error) {
            //console.error(`Errore in uno dei sensori: ${error}`);
        }
    }
    return jsonTutto;
}


module.exports = { sensorJSON, allSensorsJSON }