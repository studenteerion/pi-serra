const fs = require('fs').promises;

async function getUrlById(id) {
    try {
        const data = await fs.readFile('./config_files/....', 'utf8');
        const jsonObject = JSON.parse(data);

        for (let i = 0; i < jsonObject.length; i++) {
            if (jsonObject[i].id === id) {
                return jsonObject[i].url;
            }
        }
        return null;
    } catch (err) {
        console.error('Error:', err);
    }
}

async function addUrl(id, url) {
    try {
        const data = await fs.readFile('./sensors_list.json', 'utf8');
        const jsonObject = JSON.parse(data);

        jsonObject.push({ id: id, url: url });

        await fs.writeFile('./sensors_list.json', JSON.stringify(jsonObject));
    } catch (err) {
        console.error('Error:', err);
    }
}

async function removeUrl(id) {
    try {
        const data = await fs.readFile('./sensors_list.json', 'utf8');
        const jsonObject = JSON.parse(data);

        for (let i = 0; i < jsonObject.length; i++) {
            if (jsonObject[i].id === id) {
                jsonObject.splice(i, 1);
                break;
            }
        }

        await fs.writeFile('./sensors_list.json', JSON.stringify(jsonObject));
    } catch (err) {
        console.error('Error:', err);
    }
}

module.exports = { getUrlById, addUrl, removeUrl };