const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

async function getUrlById(filePath, id) {
    console.log("ID: " + id);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data);

        for (let i = 0; i < jsonObject.length; i++) {
            if (jsonObject[i].id == id) {
                return jsonObject[i].url;
            }
        }
        console.log("ID not found");
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
            console.log("URL removed successfully");
        } else {
            console.log("ID not found");
        }
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

async function getAllUrls(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data);
        return jsonObject.map(item => item.url);
    }
    catch (err) {
        console.error('Error:', err);
    }
}


module.exports = { getUrlById, addUrl, removeUrl, getAllUrls};
