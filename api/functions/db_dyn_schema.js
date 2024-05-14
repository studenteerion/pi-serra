const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    valueList: [{
        description: String,
        value: String,
        _id: false  // disable auto generation of _id for sub-documents
    }]
});


module.exports = mongoose.model('SensorValues', dataSchema);