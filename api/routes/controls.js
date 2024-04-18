const express = require('express');
const router = express.Router();
const actuatorData = require('../functions/getjson')
const axios = require("axios").create();
const controls = require('../functions/changestatus.js')
const configManager = require('../functions/config_files_manager.js')

const urls = require('../config_files/actuator_list.json')

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
router.get('./', async (_, res) => {
    res.send(await actuatorData.allSensorsJSON(urls.map(item => item.url)))
  })

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
 *           type: integer
 *         required: true
 *         description: The ID of the actuator.
 *     responses:
 *       '200':
 *         description: Success. Returns actuator data for the specified ID.
 *       '500':
 *         description: Internal Server Error.
 */

router.get('/:id', async (_, res) => {
    res.send(await actuatorData.sensorJSON(configManager.getUrlFromId(id)))
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
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await controls(configManager.getUrlFromId(id), status);
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
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await configManager.removeUrl(configManager.getUrlFromId(id));
    res.send('Actuator deleted successfully');
});

module.exports = router