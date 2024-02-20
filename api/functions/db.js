const mongoose = require("mongoose");

const Sensor = require("./dbscheme");
const Database = process.env.Database;

async function connect () {
    await mongoose //connessione al database
    .connect(Database)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error(`Error connecting to MongoDB: ${error}`);
    });
}


async function getData(findOne){
    try {
        if (findOne){
            return await Sensor.findOne().sort({ Time: -1 });
        }
        else {
            return await Sensor.find().sort({ Time: -1 });
        }
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

      } catch (err) {
        console.error(`Error trying to save to database: ${err}`);
      }
}


module.exports = { connect, getData, saveData };