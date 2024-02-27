const axios = require("axios").create();

const Actuator_status = process.env.Actuator_status;
const Actuator_on = process.env.Actuator_on;
const Actuator_off = process.env.Actuator_off;


async function statoAttuatore() { // ottenere stato attuatore
  try {
    const response = await axios({ // risposta
      url: Actuator_status, // indirizzo stato sensori
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
    if (await statoAttuatore() == 1) {
      try {
        await axios({ // fa spegnere la luce
          url: Actuator_on,
          method: "get",
        });
        console.log("Luce accesa");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function spegniLuce() {
  try {
    if (await statoAttuatore() == 0) {
      try {
        await axios({ // fa spegnere la luce
          url: Actuator_off,
          method: "get",
        });
        console.log("Luce spenta");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

module.exports = { accendiLuce, spegniLuce };