//ciao
const express = require("express");
const app = express();
const axios = require("axios").create();
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const server = createServer(app);

const io = new Server(server);

app.use(express.static("public"))

let datiSensori

io.on('connection', (socket) => {
	console.log('a user connected');
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

		datiSensori = response.data

		io.emit("updateData", datiSensori)

		if (datiSensori.Sensors[0].Temperature <= 30)
			accendiLuce()
		else
			spegniLuce()
		

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

setInterval(getSensorData, 10000)