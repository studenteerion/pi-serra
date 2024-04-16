const fs = require('fs');

function getUrlById(id) {

    fs.readFile('./config_files/....', 'utf8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        const jsonObject = JSON.parse(data);

        for (let i = 0; i < jsonObject.length; i++) {
            if (jsonObject[i].id === id) {
                //console.log(jsonObject[i].url);
                return jsonObject[i].url;
            }
        }
        return null;
    }
    );
}

function addUrl(id, url) {
    fs.readFile('./sensors_list.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        const jsonObject = JSON.parse(data);

        jsonObject.push({ id: id, url: url });

        fs.writeFile('./sensors_list.json', JSON.stringify(jsonObject), (err) => {
            if (err) {
                console.error('Error:', err);
                return;
            }
        });
    });
}

function removeUrl(id) {
    fs.readFile('./sensors_list.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        const jsonObject = JSON.parse(data);

        for (let i = 0; i < jsonObject.length; i++) {
            if (jsonObject[i].id === id) {
                jsonObject.splice(i, 1);
                break;
            }
        }

        fs.writeFile('./sensors_list.json', JSON.stringify(jsonObject), (err) => {
            if (err) {
                console.error('Error:', err);
                return;
            }
        });
    });
}

module.exports = { getUrlById, addUrl, removeUrl };