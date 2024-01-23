const express = require("express");
const app = express();
const axios = require("axios").create();
const mongoose = require('mongoose');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const Sensor = require('./dbscheme');
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     
  extended: true
}))

try {
	mongoose.connect('mongodb://localhost:28080/rpiSerra');  // connessione al database
} catch (error) {
	console.error(`errore: ${err.message}`)
}

const server = createServer(app);  // avvio server express

const io = new Server(server);  // avvio server websocket

app.use(express.static("public"))
app.set('view engine', 'ejs');

//variabile globale per l'emissione dei dati in API e WS
let datiSensori

io.on('connection', (socket) => {
	console.log('a user connected');
	//emissione dell'evento di update dei dati all'avvio della connessione ws
	io.emit("updateData", datiSensori)
});

//ultima lettura nel db
app.get('/api/lastdata', async (req, res) => {
	try {
		const sensorData = await Sensor.findOne().sort({Time: -1})
		res.json(sensorData) 
	} catch (err) {
		console.error(`errore: ${err.message}`)
	}
})

//tutte le letture del db
app.get('/api/alldata', async (req, res) => {
	const sensorData = await Sensor.find().sort({Time: -1})
	res.json(sensorData)
})


let panelData = {onTemperature: 30}

app.get('/pannello', (req, res) => {
	res.render('pannello.ejs', panelData)
})

app.post('/update-config-data', (req, res) => {
	panelData = req.body
	console.log(panelData);
	getSensorData()
	console.log(panelData.onTemperature);
	
	if (datiSensori.Sensors[0].Temperature <= panelData.onTemperature)
		accendiLuce()
	else
		spegniLuce()
	res.render('pannello.ejs', panelData)
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

			if (datiSensori.Sensors[0].Temperature <= panelData.onTemperature)
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