const mongoose = require("mongoose");
const Sensor = require("./db_schema");
const Database = process.env.Database;

async function connect() {
    await mongoose //connessione al database
        .connect(Database)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error(`Error connecting to MongoDB: ${error}`);
        });
}

async function getData(getOne) {
    try {
        if (getOne) {
            json = await Sensor.findOne().sort({ Time: -1 });
        }
        else {
            json = await Sensor.find().sort({ Time: -1 });
        }
        return json;
    }
    catch (err) {
        console.error(`Errore nella richiesta dati dal database: ${err}`);
        return undefined;
    }
}

async function saveData(sensorData) {
    try {
        const newSensorData = new Sensor(sensorData);
        await newSensorData.save();
        console.log("Data saved to database");
    } catch (err) {
        console.error(`Error trying to save to database: ${err}`);
    }
}


module.exports = { connect, getData, saveData };