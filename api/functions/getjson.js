const axios = require("axios").create();

async function sensorJSON(url) {
    try {
        const response = await axios({
            url: `${url}/json`,
            method: "get",
        });

        return response.data.Sensors[0].TaskValues;

    } catch (error) {
        console.error(`Errore nel richiedere il json del sensore ${url}: ${error}`);
        return `Errore nel richiedere il json del sensore ${url}: ${error}`;
    }
}

module.exports = { sensorJSON }