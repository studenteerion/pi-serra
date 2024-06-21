import { NextResponse } from "next/server"; //questo ci serve per gestire la risposta
import connect from "@/libs/database"; //questo ci serve per connettere i vari metodi
import data from "@/models/data"; //importiamo il modello Post da models/Post.ts
import { Console } from "console";
import exp from "constants";
import configManager from "@/app/functions/config_files_manager";
import actuatorData from "@/app/functions/actuator_data";

export const GET = async (req) => { //Creiamo una funzione asincrona GET che prende come parametro req
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
}

export const POST = async (req) => { //Creiamo una funzione asincrona POST che prende come parametro req
    const { description, url } = req.body;

    try {
        const id = await configManager.addUrl(filePath, description, url);
        res.status(200).json({ message: 'URL added successfully', id });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}





//la roba commentata serve per swagger
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
