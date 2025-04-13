const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('./config/connect.js');
const chessGameRouter = require('./routes/ChessGame');
const path = require('path');

const playwithfriendsRoutes = require('./routes/playwithfriendsRoutes');
const connectedUsers = require('./routes/connectedUser');
const User = require('./routes/user.js');
const puzzleRoutes = require('./routes/puzzle');
const imageRoutes = require('./routes/imageRoutes.js');
const { Console } = require('console');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chess', chessGameRouter);
app.use('/api/invitations', playwithfriendsRoutes);
app.use('/api', User);
app.use('/api/users/connected', connectedUsers);
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/images', imageRoutes);
app.use('/uploads', express.static('./uploads'));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', function(socket) {
    console.log('new connection');
    socket.on('move', function(moveData) {
        console.log('got message from client: ' + moveData);
        socket.broadcast.emit('move', moveData);
    });
    socket.on('invitation', (invitationData) => {
        console.log('Received invitation from client: ', invitationData);
        io.emit('invitation', { type: 'new', data: invitationData });
    });
});

let storedPGN = null;
let storedChessUsername = null;

app.post('/api/pgn', (req, res) => {
    console.log('Hit /api/pgn with body:', req.body);
    const { pgn } = req.body;
    if (pgn) {
        storedPGN = pgn;
        res.json({ message: 'PGN data received and stored successfully' });
    } else {
        if (storedPGN) {
            res.json(storedPGN);
        } else {
            res.status(404).json({ error: 'No stored PGN data available' });
        }
    }
});

app.post('/api/chessusername', (req, res) => {
    console.log('Hit /api/chessusername with body:', req.body);
    const { chessusername } = req.body;
    if (chessusername) {
        storedChessUsername = chessusername;
        res.json({ message: 'Chess username received and stored successfully' });
    } else {
        if (storedChessUsername) {
            res.json(storedChessUsername);
        } else {
            res.status(404).json({ error: 'No stored chess username available' });
        }
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});