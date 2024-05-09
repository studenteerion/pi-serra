const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    valueList: [{
        description: String,
        value: String
    }]
});

module.exports = mongoose.model('SensorValues', dataSchema);