const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

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

async function addUrl(filePath, description, url) {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonObject = JSON.parse(data);

    const urlExists = jsonObject.some(item => item.url === url);
    if (urlExists) {
        throw new Error('URL already exists');
    }

    const id = uuidv4();

    jsonObject.push({ id, description, url });

    await fs.writeFile(filePath, JSON.stringify(jsonObject));

    return id;
}

async function removeUrl(filePath, id) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data);

        const index = jsonObject.findIndex(item => item.id === id);
        if (index !== -1) {
            jsonObject.splice(index, 1);
            await fs.writeFile(filePath, JSON.stringify(jsonObject));
        } else {
            throw new Error('ID not found');
        }
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

module.exports = { getUrlById, addUrl, removeUrl };
