const axios = require("axios").create();
const display = require('./display');

const Light_status = `${process.env.Actuator}json`;
const Light_on = `${process.env.Actuator}tools?cmd=gpio%2C0%2C0`
const Light_off = `${process.env.Actuator}tools?cmd=gpio%2C0%2C1`


async function statoLuce() { // ottenere stato attuatore
  try {
    const response = await axios({ // risposta
      url: Light_status, // indirizzo stato sensori
      method: "get",
    });

    let statoLuce = response.data.Sensors[0].TaskValues[0].Value; // stato della luce 1 = spento; 0 = acceso

    return statoLuce;
  } catch (err) {
    console.error(`Errore nella richiesta dello stato dell'attuatore: ${err}`);
    return undefined;
  }
}

async function accendiLuce() {
  try {
    if (await statoLuce() == 1) {
      try {
        await axios({ // fa spegnere la luce
          url: Light_on,
          method: "get",
        });
        console.log("Luce accesa");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
      display.AggiornaLuce();
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function spegniLuce() {
  try {
    if (await statoLuce() == 0) {
      try {
        await axios({ // fa spegnere la luce
          url: Light_off,
          method: "get",
        });
        console.log("Luce spenta");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
      display.AggiornaLuce();
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

module.exports = { accendiLuce, spegniLuce, statoLuce };