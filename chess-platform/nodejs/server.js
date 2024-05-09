
    const express = require('express');
    const cors = require('cors');
    const http = require('http');
    const socketIO = require('socket.io');
    const mongoose = require('./config/connect.js');
    const chessGameRouter = require('./routes/ChessGame');
    const tf = require('@tensorflow/tfjs-node');
    const path = require('path');

    const playwithfriendsRoutes = require('./routes/playwithfriendsRoutes');
    const connectedUsers= require('./routes/connectedUser')

    const User = require('./routes/user.js')
    const puzzleRoutes = require('./routes/puzzle');
    const imageRoutes = require('./routes/imageRoutes.js'); // Import imageRoutes.js
    async function loadModel() {
        try {
            const modelPath = path.join(__dirname, './engine/model.json');
            const model = await tf.loadLayersModel(`file://${modelPath}`);
            console.log('Model loaded successfully');
            return model;
        } catch (error) {
            console.error('Failed to load model', error);
        }
    }
    const app = express();
    app.use(cors());
    app.use(express.json());

    loadModel().then(model => {
        app.use('/api', chessGameRouter(model));
        app.use('/api', playwithfriendsRoutes); // Utilisez les routes pour jouer aux échecs avec des amis
        app.use('/api/images', imageRoutes);
        app.use('/api',User);
        app.use('/api',connectedUsers);
        app.use('/uploads',express.static('./uploads'))
        // app.use('/api', chessGameRouter);
        app.use('/api/puzzles', puzzleRoutes);
        const server = http.createServer(app);
        const io = socketIO(server);
        io.on('connection', function(socket) {
            console.log('new connection');
            socket.on("move", function(moveData) {
                console.log('got message from client' + moveData);
                socket.broadcast.emit('move',moveData);
            });
            socket.on('invitation', (invitationData) => {
                console.log('Received invitation from client: ', invitationData);
                
                // Broadcast the received invitation to all connected clients
                io.emit('invitation', { type: 'new', data: invitationData });
              });
        });
        let storedPGN = null; // Variable to store the PGN data
        let storedChessUsername = null; // Variable to store the PGN data
        app.post('/api/pgn', (req, res) => {
            const { pgn } = req.body;
        
            if (pgn) {
                // If the request contains PGN data, store it
                storedPGN = pgn;
                res.json({ message: 'PGN data received and stored successfully' });
            } else {
                // If there's no new PGN data in the request body, send back the stored PGN data
                if (storedPGN) {
                    res.json(storedPGN); // Send back the stored PGN data in the response
                } else {
                    // If there's no stored PGN data available, send an appropriate response
                    res.status(404).json({ error: 'No stored PGN data available' });
                }
            }
        });
        app.post('/api/chessusername', (req, res) => {
            const { chessusername } = req.body;
        
            if (chessusername) {
                // If the request contains PGN data, store it
                storedChessUsername = chessusername;
                res.json({ message: 'PGN data received and stored successfully' });
            } else {
                // If there's no new PGN data in the request body, send back the stored PGN data
                if (storedChessUsername) {
                    res.json(storedChessUsername); // Send back the stored PGN data in the response
                } else {
                    // If there's no stored PGN data available, send an appropriate response
                    res.status(404).json({ error: 'No stored PGN data available' });
                }
            }
        });
        
        const PORT = 3000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
