const express = require('express');
const router = express.Router();
const sensorData = require('../functions/getjson')
const db = require('../functions/db');

const urls = require('../config_files/sensors_list.json')

/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Retrieve data from all connected sensors.
 *     tags: [Sensors]
 *     responses:
 *       '200':
 *         description: Success. Returns data from all connected sensors.
 *       '500':
 *         description: Internal Server Error.
 */
router.get('./', async (_, res) => {
  res.send(await sensorData.allSensorsJSON(urls.map(item => item.url)))
})

/** 
 * @swagger
 * /sensors:
 *   post:
 *     summary: Add a sensor device
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - url
 *             properties:
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       '200':
 *         description: URL added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       '500':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/', async (req, res) => {
  const { description, url } = req.body;
  const filePath = 'config_files/sensors_list.json';

  try {
      const id = await configManager.addUrl(filePath, description, url);
      res.status(200).json({ message: 'URL added successfully', id });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /sensors/{id}:
 *   get:
 *     summary: Retrieve sensor data for a specific ID.
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the sensor.
 *     responses:
 *       '200':
 *         description: Success. Returns sensor data for the specified ID.
 *       '500':
 *         description: Internal Server Error.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  res.send(await sensorData.sensorJSON(configManager.getUrlById('config_files/sensor_list.json', id)))
})

/**
 * @swagger
 * /sensors/{id}:
 *   delete:
 *     summary: Delete a sensor.
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the sensor to delete.
 *     responses:
 *       '200':
 *         description: sensor deleted successfully.
 *       '500':
 *         description: Internal Server Error.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await configManager.removeUrl(configManager.getUrlById('config_files/sensor_list.json', id));
  res.send('Sensor deleted successfully');
});

/**
 * @swagger
 * /sensors/db-data/last:
 *   get:
 *     tags:
 *       - Sensors
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
 * /sensors/db-data:
 *   get:
 *     tags:
 *       - Sensors
 *     summary: Get all sensor data saved in the database
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

module.exports = router;