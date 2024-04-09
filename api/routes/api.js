const express = require('express');
const router = express.Router();

const db = require('../functions/db');

/**
 * @swagger
 * /api/lastdata:
 *   get:
 *     summary: Get the last sensor data saved in the database
 *     responses:
 *       200:
 *         description: Returns the last instance of data
 */
router.get("/api/lastdata", async (_, res) => {
  res.json(await db.getData(true));
});

/**
 * @swagger
 * /api/alldata:
 *   get:
 *     summary: Get all sensor data stored in the database
 *     responses:
 *       200:
 *         description: Returns all data
 */
router.get("/api/alldata", async (_, res) => {
  res.json(await db.getData(false));
});

module.exports = router;