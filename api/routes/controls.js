const express = require('express');
const router = express.Router();
const actuatorData = require('../functions/getjson')
const axios = require("axios").create();
const controls = require('../functions/changestatus.js')

const urls = require('../config_files/actuator_list.json')
 
router.get('/', async (_, res) => {
    res.send(await actuatorData.allSensorsJSON(urls.map(item => item.url)))
})

router.put('/:id', async (req, res) => {
    controls(req.params.id, )
})