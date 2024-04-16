const axios = require("axios").create();

async function sensorJSON(url) {
    const response = await axios({
        url: url,
        method: "get",
    });

    return response.data.Sensors;
}


async function allSensorsJSON(urls) {
    try {
        const responses = await Promise.all(urls.map(url => axios.get(`${url}/json`)));
        const jsonTutto = responses.map(response => response.data.Sensors);
        return jsonTutto
    } catch (error) {
        console.error(`Errore in uno dei sensori: ${error}`)
        throw error;
    }
}


module.exports = { sensorJSON, allSensorsJSON }