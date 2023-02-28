const {createServer} = require('http')
const express = require('express')

const mongoose = require('mongoose')

const WebSocket = require('ws')
const MessageController = require('./controllers/messageController')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

const server = createServer(app)
//server.listen(PORT, () => console.log('Server is running on ', PORT))

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/')
        server.listen(PORT, () => console.log('Server is running on ', PORT))
    } catch (e) {
        console.log('Error' + e);
    }
}

start()

const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        console.log(message);
        ws.id = message.campaignId
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                
                broadcastMessagesOnConnection(message)
                break;
        }
    })

})

//id == campaign id
function broadcastMessage(message) {
    wss.clients.forEach(client => {
        if (client.id === message.campaignId) {
            MessageController.saveNewMessage(message.username, message.campaignId, message.message, message.date)
            console.log('sending to id: ' + message.campaignId);
            client.send(JSON.stringify(message))
        }
    })
}

function broadcastMessagesOnConnection(message) {
    wss.clients.forEach(client => {
        if (client.id === message.campaignId) {
            console.log('restoring messages to: ' + message.campaignId);

            MessageController.getMessages(message.campaignId).then((messages) => {
                console.log('restored: ', messages);
                client.send(JSON.stringify(messages))
            })
        }
    })
}




