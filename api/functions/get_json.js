const axios = require("axios").create();

async function sensorJSON(url) {
    try {
        const response = await axios({
            url: `${url}/json`,
            method: "get",
        });

        return response.data.Sensors[0].TaskValues;

    } catch (error) {
        console.error(`Error requesting sensor JSON at ${url}: ${error}`);
        throw error;
    }
}

module.exports = { sensorJSON }