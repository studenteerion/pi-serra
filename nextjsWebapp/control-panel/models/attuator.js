import mongoose from 'mongoose';

const dataSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    valueList: [{
        description: String,
        value: String,
        _id: false
    }]
});


const data=  models.data || mongoose.model('Post', dataSchema);

export default data;