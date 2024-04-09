const axios = require("axios").create();
const display = require('./display');

const Pump_status = `${process.env.Pump}json`;
const Pump_on = `${process.env.Pump}tools?cmd=gpio%2C0%2C0`
const Pump_off = `${process.env.Pump}tools?cmd=gpio%2C0%2C1`



async function statoPompa() { // ottenere stato pompa
  try {
    const response = await axios({ // risposta
      url: Pump_status, // indirizzo stato sensori
      method: "get",
    });

    let statoPompa = response.data.Sensors[0].TaskValues[0].Value; // stato della pompa 0 = spento; 1 = acceso

    display.AggiornaPompa(statoPompa);

    return statoPompa;
  } catch (err) {
    console.error(`Errore nella richiesta dello stato della pompa: ${err}`);
    return undefined;
  }
}

async function accendiPompa() {
  try {
    if (await statoPompa() == 0) {
      try {
        await axios({ // fa accendere la pompa
          url: Pump_on,
          method: "get",
        });
        console.log("Pompa accesa");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
      display.AggiornaPompa(1);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function spegniPompa() {
  try {
    if (await statoPompa() == 1) {
      try {
        await axios({ // fa spegnere la pompa
          url: Pump_off,
          method: "get",
        });
        console.log("Pompa spenta");
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
      
      display.AggiornaPompa(0);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

module.exports = { accendiPompa, spegniPompa, statoPompa }