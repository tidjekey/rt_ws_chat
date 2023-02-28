const { Schema, model } = require('mongoose')

const Message = new Schema({
    username: {
        type: String,
        required: true
    },
    campaignId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = model('Message', Message)