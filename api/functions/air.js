/* const axios = require("axios").create();
const display = require('./display');

const Air_status = `${process.env.Air}json`;
const Air_on = `${process.env.Air}tools?cmd=gpio%2C0%2C0`
const Air_off = `${process.env.Air}tools?cmd=gpio%2C0%2C1`

async function statoAria() { // ottenere stato aria
  try {
    const response = await axios({ // risposta
      url: Air_status, // indirizzo stato sensori
      method: "get",
    });

    let statoLuce = response.data.Sensors[0].TaskValues[0].Value; // stato dell'aria 1 = spento; 0 = acceso

    return statoLuce;
  } catch (err) {
    console.error(`Errore nella richiesta dello stato dell'Aria: ${err}`);
    return undefined;
  }
}

async function accendiAria() {
  try {
    if (await statoAria() == 1) {
      try {
        await axios({ // fa accendere l'aria
          url: Air_on,
          method: "get",
        });
        console.log("Aria accesa");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
      display.AggiornaAria();
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function spegniAria() {
  try {
    if (await statoAria() == 0) {
      try {
        await axios({ // fa spegnere l'aria
          url: Air_off,
          method: "get",
        });
        console.log("Aria spenta");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
      display.AggiornaAria();
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

module.exports = { accendiAria, spegniAria, statoAria } */