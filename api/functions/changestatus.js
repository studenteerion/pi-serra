const axios = require("axios").create();

module.exports = async function changeStatus(url, status) {
    try {
        console.log(url);
        await axios({
            url: `${url}/tools?cmd=gpio%2C0%2C${status}`,
            method: "get",
        });
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
};