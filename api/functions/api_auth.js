const users = require('../api_keys.json')

const authenticateKey = (req, res, next) => {
    let api_key = req.header("X-API-KEY");
    console.log(api_key);
    let account = users.find((user) => user.api_key == api_key);
    if (account) {
        console.log("Found user with matching key");
        next()
    } else {
        res.status(401).send({ error: { code: 401, message: "Unauthorized. Key not found." } });
    }
}

module.exports = { authenticateKey };