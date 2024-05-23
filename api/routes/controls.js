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
 *     security:
 *       - ApiKeyAuth: []  # Use the same arbitrary name you have given to the security scheme
 *     responses:
 *       '200':
 *         description: Success. Returns data from all connected actuators.
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
        let status = 'reachable';
        try {
            data = await actuatorData.sensorJSON(device.url)
        } catch (err) {
            console.error(`Could not fetch the device: ${err}`);
            data = undefined
            status = 'unreachable';
        }
        response.push({
            id: device.id,
            description: device.description,
            status: status,
            values: data
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
 *     security:
 *       - ApiKeyAuth: []  # Use the same arbitrary name you have given to the security scheme
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
 * /controls/{id}:
 *   get:
 *     summary: Retrieve actuator data for a specific ID.
 *     tags: [Controls]
 *     security:
 *       - ApiKeyAuth: []  # Use the same arbitrary name you have given to the security scheme
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
            values: await actuatorData.sensorJSON(device.url)
        }
        res.send(response)
    } catch (error) {
        res.status(401).send({ error: { code: 404, message: "Device not found." } });
    }
})

/**
 * @swagger
 * /controls/{id}:
 *   put:
 *     summary: Update the status of an actuator.
 *     tags: [Controls]
 *     security:
 *       - ApiKeyAuth: []  # Use the same arbitrary name you have given to the security scheme
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the actuator.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *             required:
 *               - status
 *     responses:
 *       '200':
 *         description: Status changed successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Status changed successfully'
 *       '400':
 *         description: Bad Request. The request body is not provided or not in the correct format.
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
 *       '500':
 *         description: Internal Server Error.
 */
router.put('/:id', API.authenticateKey, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        res.status(400).send('Bad Request. The request body must be a JSON object with a "status" property.');
        return;
    }

    console.log("Preparing");
    const device = await configManager.getDeviceById(filePath, id)
    await controls(device.url, status);
    console.log("Updated successfully")
    res.send('Status changed successfully');
});


/**
 * @swagger
 * /controls/{id}:
 *   delete:
 *     summary: Delete an actuator.
 *     tags: [Controls]
 *     security:
 *       - ApiKeyAuth: []  # Use the same arbitrary name you have given to the security scheme
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
 *       '401':
 *         description: Unauthorized. You are not allowed to access this resource.
 *       '500':
 *         description: Internal Server Error.
 */
router.delete('/:id', API.authenticateKey, async (req, res) => {
    const { id } = req.params;
    await configManager.removeUrl(filePath, id);
    res.send('Actuator deleted successfully');
});

module.exports = router