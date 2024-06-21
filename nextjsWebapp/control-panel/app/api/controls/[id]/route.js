import { NextResponse } from "next/server"; //questo ci serve per gestire la risposta
import connect from "@/libs/database"; //questo ci serve per connettere i vari metodi
import data from "@/models/data"; //importiamo il modello Post da models/Post.ts
import { Console } from "console";
import exp from "constants";

export const GET = async (req, {params}) => { //Creiamo una funzione asincrona GET che prende come parametro req
    const { id } = params;
    try {
        const device = await configManager.getDeviceById(filePath, id)
        const response = {
            description: device.description,
            values: await actuatorData.sensorJSON(device.url)
        }
        return NextResponse.json(response, {status: 200}); //Ritorniamo i post in formato JSON
    } catch (error) {
        return NextResponse.json( // se c'è un errore ritorniamo un messaggio di errore e uno status 500
            { message: "Device not found.", error}.error, 
            {status: 404});
    }
}


/* router.get('/:id', API.authenticateKey, async (req, res) => {
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
}) */