const express = require('express');
const { createServer } = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/users')

const app = express();
const server = createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:5173', // Frontend URL
        methods: ['GET', 'POST']
    }
});

// MongoDB connection (make sure MongoDB is running)
mongoose.connect('mongodb://localhost/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Chat message schema
const ChatMessageSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

app.use(cors()); // Enable CORS for the frontend
app.use(express.json()); // Enable JSON parsing
app.use('/user',userRouter)

// API route to get chat history
app.get('/messages', async (req, res) => {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.json(messages);
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for chat messages from client
    socket.on('chatMessage', async (data) => {
        console.log("User:", data.user, "Message:", data.message);

        // Save message to MongoDB if needed
        const newMessage = new ChatMessage({
            user: data.user,
            message: data.message
        });
        await newMessage.save();

        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
