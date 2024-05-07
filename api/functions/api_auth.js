const users = require('../api_keys.json')

const authenticateKey = (req, res, next) => {
    let api_key = req.header("x-api-key"); //Add API key to headers
    let account = users.find((user) => user.api_key == api_key);
    if (account) {
        console.log("Found user with matching key");
        next()
    } else {
        res.status(403).send({ error: { code: 403, message: "You not allowed." } });
    }
}

module.exports = { authenticateKey };