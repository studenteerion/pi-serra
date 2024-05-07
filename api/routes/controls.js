const express = require('express');
const router = express.Router();
const actuatorData = require('../functions/getjson')
const controls = require('../functions/changestatus.js')
const configManager = require('../functions/config_files_manager.js')
const API = require('../functions/api_auth');
const filePath = 'config_files/actuators_list.json';

/**
 * @swagger
 * /controls:
 *   get:
 *     summary: Retrieve data from all connected actuators.
 *     tags: [Controls]
 *     responses:
 *       '200':
 *         description: Success. Returns data from all connected actuators.
 *       '500':
 *         description: Internal Server Error.
 */
router.get('/', API.authenticateKey, async (_, res) => {
    const devices = await configManager.getAllDevices(filePath)
    console.log(devices);
    const response = []
    for (const device of devices) {
        console.log(device.url);
        response.push({
            id: device.id,
            description: device.description,
            values: await actuatorData.sensorJSON(device.url)
        })
    }

    res.send(response)
})

/** 
 * @swagger
 * /controls:
 *   post:
 *     summary: Add an actuator device
 *     tags: [Controls]
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
 * /controls/{id}:
 *   get:
 *     summary: Retrieve actuator data for a specific ID.
 *     tags: [Controls]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the actuator.
 *     responses:
 *       '200':
 *         description: Success. Returns actuator data for the specified ID.
 *       '500':
 *         description: Internal Server Error.
 */

router.get('/:id', API.authenticateKey, async (req, res) => {
    const { id } = req.params;
    const device = await configManager.getDeviceById(filePath, id)
    const response = {
        description: device.description,
        values: await actuatorData.sensorJSON(device.url)
    }
    res.send(response)
})

/**
 * @swagger
 * /controls/{id}:
 *   put:
 *     summary: Update the status of an actuator.
 *     tags: [Controls]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the actuator.
 *       - in: body
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: The desired status value for the actuator.
 *     responses:
 *       '200':
 *         description: Status changed successfully.
 *       '500':
 *         description: Internal Server Error.
 *
 */
router.put('/:id', API.authenticateKey, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log("Preparing");
    await controls(await configManager.getUrlById(filePath, id), status);
    console.log("Updated succesfully")
    res.send('Status changed successfully');
});

/**
 * @swagger
 * /controls/{id}:
 *   delete:
 *     summary: Delete an actuator.
 *     tags: [Controls]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the actuator to delete.
 *     responses:
 *       '200':
 *         description: Actuator deleted successfully.
 *       '500':
 *         description: Internal Server Error.
 */
router.delete('/:id', API.authenticateKey, async (req, res) => {
    const { id } = req.params;
    await configManager.removeUrl(filePath, id);
    res.send('Actuator deleted successfully');
});

module.exports = router