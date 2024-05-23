const express = require('express');
const router = express.Router();
const sensorData = require('../functions/get_json')
const db = require('../functions/db');
const configManager = require('../functions/config_files_manager.js')
const API = require('../functions/api_auth');
const filePath = 'config_files/sensors_list.json';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:   # arbitrary name for the security scheme
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY  # name of the header, parameter or cookie
 * /sensors:
 *   get:
 *     summary: Retrieve data from all connected sensors.
 *     tags: [Sensors]
 *     security:
 *       - ApiKeyAuth: [] 
 *     responses:
 *       '200':
 *         description: Success. Returns data from all connected sensors.
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
 *       '500':
 *         description: Internal Server Error.
 */
router.get('/', API.authenticateKey, async (_, res) => {
  const devices = await configManager.getAllDevices(filePath)
  console.log(devices);
  const response = []
  for (const device of devices) {
    console.log(device.url);
    let data
    let status = 'reachable'; // Assume reachable by default
    try {
      data = await sensorData.sensorJSON(device.url)
    } catch (err) {
      console.error(`Could not fetch the device: ${err}`);
      data = undefined
      status = 'unreachable'; // Update status if unreachable
    }
    response.push({
      id: device.id,
      description: device.description,
      status: status, // Include device status in the response
      values: data
    })
  }

  res.send(response)
})

/**
 * @swagger
 * /sensors:
 *   post:
 *     summary: Add a sensor device
 *     tags: [Sensors]
 *     security:
 *       - ApiKeyAuth: []
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
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
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
router.post('/', API.authenticateKey, async (req, res) => {
  const { description, url } = req.body;
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
 *           type: string
 *         required: true
 *         description: The ID of the sensor.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       '200':
 *         description: Success. Returns sensor data for the specified ID.
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
 *       '500':
 *         description: Internal Server Error.
 */
router.get('/:id', API.authenticateKey, async (req, res) => {
  try {
    const { id } = req.params;
    const device = await configManager.getDeviceById(filePath, id)
    const response = {
      description: device.description,
      values: await sensorData.sensorJSON(device.url)
    }
    res.send(response)
  } catch (error) {
    res.status(404).send({ error: { code: 404, message: "Device not found." } });
  }

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
 *           type: string
 *         required: true
 *         description: The ID of the sensor to delete.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       '200':
 *         description: Sensor deleted successfully.
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
 *       '500':
 *         description: Internal Server Error.
 */
router.delete('/:id', API.authenticateKey, async (req, res) => {
  const { id } = req.params;
  await configManager.removeUrl(filePath, id);
  res.send('Sensor deleted successfully');
});

/**
 * @swagger
 * /sensors/db-data/last:
 *   get:
 *     tags:
 *       - Sensors
 *     summary: Get the last sensor data saved in the database
 *     security:
 *       - ApiKeyAuth: []  # Use the same arbitrary name you have given to the security scheme
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
 *       '200':
 *         description: Success. Returns the last instance of data saved in the database
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
 *       '500':
 *         description: Internal Server Error.
 */
router.get("/db-data/last", API.authenticateKey, async (_, res) => {
  res.json(await db.getData(true));
});

/**
 * @swagger
 * /sensors/db-data/all:
 *   get:
 *     tags:
 *       - Sensors
 *     summary: Get all sensor data saved in the database
 *     security:
 *       - ApiKeyAuth: []  # Use the same arbitrary name you have given to the security scheme
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
 *       '200':
 *         description: Success. Returns every instance of data saved in the database
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
 *       '500':
 *         description: Internal Server Error.
 */
router.get("/db-data/all", API.authenticateKey, async (_, res) => {
  res.json(await db.getData(false));
});

module.exports = router;