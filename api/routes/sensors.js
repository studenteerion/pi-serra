const express = require('express');
const router = express.Router();
const actuatorData = require('../functions/getjson')
const db = require('../functions/db');

const urls = require('../config_files/sensors_list.json')

/**
 * @swagger
 * /sensors/lastdata:
 *   get:
 *     tags:
 *       - sensors
 *     summary: Get the last sensor data saved in the database
 *     responses:
 *       200:
 *         description: Returns the last instance of data
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    format: byte
 *                    pattern: '^[a-zA-Z0-9]{24}$'
 *                    description: The unique id of the data instance in the database
 *                    example: "39W02mL9ms92mSi2z3o20ms1"
 *                  Temperature:
 *                    type: number
 *                    format: float
 *                    description: The temperature value
 *                    example: 25
 *                  Humidity:
 *                    type: number
 *                    format: float
 *                    description: The humidity value
 *                    example: 50
 *                  Time:
 *                    type: string
 *                    format: date-time
 *                    description: The time when the data was recorded.
 *                    example: "2024-04-11T01:14:00Z"
 */
router.get("/db-data/last", async (_, res) => {
  res.json(await db.getData(true));
});

/**
 * @swagger
 * /sensors/alldata:
 *   get:
 *     tags:
 *       - sensors
 *     summary: Get the last sensor data saved in the database
 *     responses:
 *       200:
 *         description: Returns the last instance of data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     pattern: '^[a-zA-Z0-9]{24}$'
 *                     description: The unique id of the data instance in the database
 *                     example: "39W02mL9ms92mSi2z3o20ms1"
 *                   Temperature:
 *                     type: number
 *                     format: float
 *                     description: The temperature value
 *                     example: 25
 *                   Humidity:
 *                     type: number
 *                     format: float
 *                     description: The humidity value
 *                     example: 50
 *                   Time:
 *                     type: string
 *                     format: date-time
 *                     description: The time when the data was recorded.
 *                     example: "2024-04-11T01:14:00Z"
 */

router.get("/db-data", async (_, res) => {
  res.json(await db.getData(false));
});

router.get('./', async (_, res) => {
  res.send(await sensorData.allSensorsJSON(urls.map(item => item.url)))
})

module.exports = router;