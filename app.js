const express = require("express");
const app = express();
const axios = require("axios").create();
const mongoose = require('mongoose');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const Sensor = require('./dbscheme');

mongoose.connect('mongodb://localhost:28080/rpiSerra');

const server = createServer(app);

const io = new Server(server);

app.use(express.static("public"))

let datiSensori

io.on('connection', (socket) => {
	console.log('a user connected');
	io.emit("updateData", datiSensori)
});

app.get('/api/lastdata', async (req, res) => {
	try {
		const sensorData = await Sensor.findOne().sort({Time: -1})
		res.json(sensorData) 
	} catch (err) {
		console.error(`errore: ${err.message}`)
	}
})

app.get('/api/alldata', async (req, res) => {
	const sensorData = await Sensor.find().sort({Time: -1})
	res.json(sensorData)
})



server.listen(8080, () => {
	console.log("Server started at port 8080");
	
});

async function getSensorData() {
	try {
		const response = await axios({
			url: "http://192.168.112.54/json",
			method: "get",
		});

		//Verifica di differenze rispetto ai dati precedenti
		//Se vero, invio evento tramite websocket
		
		if (!datiSensori || datiSensori.Sensors[0].Temperature != response.data.Sensors[0].Temperature || datiSensori.Sensors[0].Humidity != response.data.Sensors[0].Humidity) {
			datiSensori = response.data
			io.emit("updateData", datiSensori)

			try {
				const newSensorData = new Sensor(response.data.Sensors[0])
				await newSensorData.save()
			} catch (err) {
				console.error(`errore: ${err.message}`);
			}

			if (datiSensori.Sensors[0].Temperature <= 30)
				accendiLuce()
			else
				spegniLuce()
		}
	} catch (err) {
		console.error(`errore: ${err.message}`)
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
				console.error(`errore: ${err.message}`)
			}
		}

	} catch (err) {
		console.error(`errore: ${err.message}`)
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
				console.error(`errore: ${err.message}`)
			}
		}

	} catch (err) {
		console.error(`errore: ${err.message}`)
	}

	console.log("Luce spenta")
}

getSensorData()
setInterval(getSensorData, 10000)