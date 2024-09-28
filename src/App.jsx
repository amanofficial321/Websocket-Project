import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/user/login', { email, password });
            if (response.data.success) {
                setUsername(response.data.username);
                setAuthenticated(true);
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = () => {
        if (message && authenticated) {
            socket.emit('chatMessage', { user: username, message });
            setMessage('');
        }
    };

    // Set up WebSocket listener inside useEffect
    useEffect(() => {
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Clean up the socket listener when the component unmounts
        return () => {
            socket.off('message');
        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <div>
            {!authenticated ? (
                <div>
                    <h1>Login</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={login}>Login</button>
                </div>
            ) : (
                <div>
                    <h1>Chat</h1>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}><strong>{msg.user}</strong>: {msg.message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
