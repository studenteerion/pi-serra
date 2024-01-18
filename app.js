const express = require("express");
const app = express();
const axios = require("axios").create();
const mongoose = require('mongoose');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const Sensor = require('./dbscheme');

//mongoose.connect('mongodb://localhost:???/databse_name');

/* // json
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const readingsJson = './public/data/readings.json'
*/

const server = createServer(app);

const io = new Server(server);

app.use(express.static("public"))

let datiSensori

io.on('connection', (socket) => {
	console.log('a user connected');
	io.emit("updateData", datiSensori)
});

server.listen(8080, () => {
	console.log("Server started at port 8080");
	
});

async function getSensorData() {
	try {
		const response = await axios({
			url: "http://192.168.112.54/json",
			method: "get",
		});

		/* fs.readFile(readingsJson, (error, data) => {
			if (error) {
				console.log(error);
				return;
			  }
			const letture = JSON.parse(data);
		})

		const lettura = {
			data: new Date(),
			temperatura: datiSensori.Sensors[0].Temperature,
			umidità: datiSensori.Sensors[0].Humidity
		}

		fs.writeFile(readingsJson, lettura, (error) => {
			if (error) {
				console.log('An error has occurred ', error);
				return;
			}
			console.log('Data written successfully to disk');
		}) 

		try {
			const newSensorData = new Sensor(response.data)
			await newSensorData.save()
		} catch (err) {
			console.log(err);
		}	*/

		//Verifica di differenze rispetto ai dati precedenti
		//Se vero, invio evento tramite websocket
		
		if (!datiSensori || datiSensori.Sensors[0].Temperature != response.data.Sensors[0].Temperature || datiSensori.Sensors[0].Humidity != response.data.Sensors[0].Humidity) {
			if (datiSensori) {
				console.log(datiSensori.Sensors[0])
				console.log(response.data.Sensors[0])
			}
				
			datiSensori = response.data
			io.emit("updateData", datiSensori)
	
			if (datiSensori.Sensors[0].Temperature <= 30)
				accendiLuce()
			else
				spegniLuce()
		}
	} catch (err) {
		console.log(`errore: ${err.message}`)
	}
}

async function accendiLuce() {
	try {
		const response = await axios({
			url: "http://192.168.112.53/json",
			method: "get",
		});

		let datiLuce = response.data.Sensors[0].TaskValues[0].Value

		if (datiLuce == 1) {
			try {
				const response = await axios({
					url: "http://192.168.112.53/tools?cmd=gpio%2C0%2C0",
					method: "get",
				});
			} catch (err) {
				console.log(`errore: ${err.message}`)
			}
		}

	} catch (err) {
		console.log(`errore: ${err.message}`)
	}

	console.log("Luce accesa")
}

async function spegniLuce() {
	try {
		const response = await axios({
			url: "http://192.168.112.53/json",
			method: "get",
		});

		let datiLuce = response.data.Sensors[0].TaskValues[0].Value

		if (datiLuce == 0) {
			try {
				const response = await axios({
					url: "http://192.168.112.53/tools?cmd=gpio%2C0%2C1",
					method: "get",
				});
			} catch (err) {
				console.log(`errore: ${err.message}`)
			}
		}

	} catch (err) {
		console.log(`errore: ${err.message}`)
	}

	console.log("Luce spenta")
}

getSensorData()
setInterval(getSensorData, 10000)


// test github desktop