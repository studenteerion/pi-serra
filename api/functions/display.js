const axios = require("axios").create();
const display = process.env.Display;
const { stat } = require("fs");
//const sensors = require('./sensors');

const sensors = require('./sensors');


let Temperature_line = 1
let Temperature_column = 1

let Humidity_line = 3
let Humidity_column = 1

let Light_line = 5
let Light_column = 1

let Pump_line = 6
let Pump_column = 1

let Air_line = 7
let Air_column = 1

//se stringhe non visualizzate correttamente provare ad utilizzare encodeURIComponent()

async function scrivi(data) {
    //let data = sensors.getDatiSensori; //prende i dati della temperatura e dell'umidità e li mette in variabili separate
    let Temperature = `temperature:${String(data.Temperature)}°C`;  //se non funziona cambiare in: `TEMPERATURA%3A%20${String(data.Temperature)}%20%C2%B0C`
    let Humidity = `humidity: ${String(data.Humidity)}%`;  //se non funziona cambiare in: `UMIDIT%C3%80%3A%20${String(data.Humidity)}%20%25`

    try {
        await axios({  //pulisce display
            url: `${display}OLED,${Temperature_line},`,
            method: "get",
        });

        await axios({  //pulisce display
            url: `${display}OLED,${Humidity_line},`,
            method: "get",
        });

        await axios({ // scrive su display la temperatura
            url: `${display}OLED,${Temperature_line},${Temperature_column},${Temperature}`,
            method: "get",
        });

        await axios({ // scrive su display l'umidità
            url: `${display}OLED,${Humidity_line},${Humidity_column},${Humidity}`,
            method: "get",
        });

        console.log("scritto su display");

    } catch (err) {
        console.error(`Error trying to write to display: ${err.message}`);
    }
}

/* async function pulisciCampo(campo) {
    try {
        await axios({ // pulisce il campo prima di aggiornarlo
            url: `${display}OLED,${campo},            `,
            method: "get",
        });
        console.log(`pulito il campo ${campo}`);
    } catch (err) {
        console.error(`Error nella pulizia del campo ${campo}: ${err.message}`);
    }
} */

async function AggiornaLuce(status) {
    //pulisciCampo(Light_line);
    let statoLuce = status;
    //console.log(statoLuce);
    let stato = "error";
    try {
        if (statoLuce == 1) {
            stato = "spenta";
        } if (statoLuce == 0) {
            stato = "accesa";
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }

    try {
        await axios({ // fa vedere lo stato della luce
            url: `${display}OLED,${Light_line},${Light_column}, LUCE: ${stato}`,
            method: "get",
        });
        console.log("Aggiornato stato della luce sul display");
    } catch (err) {
        console.error(`Error nell'aggiornamento dello stato della luce sul display: ${err.message}`);
    }
}

async function AggiornaPompa(status) {
    //pulisciCampo(Pump_line);
    let statoPompa = status;
    let stato = "error";
    try {
        if (statoPompa == 1) {
            stato = "spenta";
        }
        if (statoPompa == 0) {
            stato = "accesa";
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }

    try {
        await axios({ // fa vedere lo stato della pompa
            url: `${display}OLED,${Pump_line},${Pump_column}, POMPA: ${stato}`,
            method: "get",
        });
        console.log("Aggiornato stato della pompa sul display");
    } catch (err) {
        console.error(`Error nell'aggiornamento dello stato della pompa sul display: ${err.message}`);
    }
}

async function AggiornaAria(status) {
    //pulisciCampo(Air_line);
    let statoAria = status;
    let stato = "error";
    try {
        if (statoAria == 0) {
            stato = "accesa";
        }
        if (statoAria == 1) {
            stato = "spenta";
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }

    try {
        await axios({ // fa vedere lo stato delL'aria
            url: `${display}OLED,${Air_line},${Air_column}, ARIA: ${stato}`,
            method: "get",
        });
        console.log("Aggiornato stato dell'aria sul display");
    } catch (err) {
        console.error(`Error nell'aggiornamento dello stato dell'aria sul display: ${err.message}`);
    }
}

//setTimeout(AggiornaLuce, 3000);
//setTimeout(AggiornaPompa, 5000);
//setTimeout(AggiornaAria, 7000);

module.exports = { scrivi, AggiornaLuce, AggiornaPompa, AggiornaAria }