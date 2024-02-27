const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    Temperature: {
        type: Number,
        required: true
    },

    Humidity: {
        type: Number,
        required: true
    },

    Time: {
        type: Date,
        default: Date.now
    }
},
    { versionKey: false }
);

module.exports = mongoose.model('Sensor', dataSchema);