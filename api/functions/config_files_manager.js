const fs = require('fs').promises;

async function getUrlById(filePath, id) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data);

        for (let i = 0; i < jsonObject.length; i++) {
            if (jsonObject[i].id === +id) {
                return jsonObject[i].url;
            }
        }
        return null;
    } catch (err) {
        console.error('Error:', err);
    }
}

async function addUrl(filePath, id, url) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data);

        jsonObject.push({ id: id, url: url });

        await fs.writeFile(filePath, JSON.stringify(jsonObject));
    } catch (err) {
        console.error('Error:', err);
    }
}

async function removeUrl(id) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data);

        for (let i = 0; i < jsonObject.length; i++) {
            if (jsonObject[i].id === id) {
                jsonObject.splice(i, 1);
                break;
            }
        }

        await fs.writeFile(filePath, JSON.stringify(jsonObject));
    } catch (err) {
        console.error('Error:', err);
    }
}

module.exports = { getUrlById, addUrl, removeUrl };