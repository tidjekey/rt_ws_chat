const { json } = require('express');
const Message = require('../models/Message')

class MessageController {
    async saveNewMessage(username, campaignId, message, date) {
        try {
            const newMessage = new Message({username, campaignId, message, date})
            newMessage.save()
            console.log('msg saved');
        } catch (e) {
            console.log(e);
        }
    }

    async getMessages(campaignId) {
        try {
            const messages = await Message.find({campaignId: campaignId})
            console.log('getting msgs from db', messages);

            return messages
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new MessageController()