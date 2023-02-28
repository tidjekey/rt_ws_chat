import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

const ChatsPage = () => {
    const [campaignId, setCampaignId] = useState('')
    const [username, setUsername] = useState('')

    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')

    const socket = useRef()

    const [connected, setConnected] = useState(false)

    useEffect(() => {
        console.log(messages);
    }, [messages])

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                campaignId: campaignId
            }
            console.log('Socket connected');
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [...message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket closed');
        }

        socket.current.onerror = () => {
            console.log('Socked error');
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            campaignId: campaignId,
            event: 'message',
            date: Date.now()
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div>
                Введите id рекламной кампании
                <input
                    placeholder='campaign id'
                    value={campaignId}
                    onChange={e => setCampaignId(e.target.value)}
                />
                <br />
                Введите username
                <input
                    placeholder='username'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <br />
                <button onClick={connect} >Connect</button>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginTop: '20px' }}>
                <input
                    placeholder='message'
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <button onClick={sendMessage}>Отправить сообщение</button>
            </div>
            <br />
            <div>
                {messages.map((message) =>
                    <div style={{ display: 'flex', border: '1px solid red' }} key={message._id}>
                        <div>
                            {message.username}: {message.message} 
                            <br/>
                            {message.date}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatsPage
