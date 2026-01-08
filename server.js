const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store rooms
const rooms = new Map();

// Generate random room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Generate random password
function generatePassword() {
    const chars = '0123456789';
    let password = '';
    for (let i = 0; i < 4; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Get random word from list
function getRandomWord() {
    const words = [
        'PIZZA', 'BANANA', 'COMPUTER', 'ELEPHANT', 'SUNGLASSES',
        'GUITAR', 'MOUNTAIN', 'OCEAN', 'BUTTERFLY', 'CHOCOLATE',
        'RAINBOW', 'TELESCOPE', 'KEYBOARD', 'TREASURE', 'VOLCANO',
        'SPACESHIP', 'DINOSAUR', 'PYRAMID', 'LIGHTHOUSE', 'TELESCOPE',
        'JELLYFISH', 'TREASURE', 'CASTLE', 'DRAGON', 'WIZARD',
        'UNICORN', 'ROCKET', 'DIAMOND', 'CRYSTAL', 'MAGIC'
    ];
    return words[Math.floor(Math.random() * words.length)];
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Create room
    socket.on('createRoom', (data) => {
        const { playerName } = data;
        const roomCode = generateRoomCode();
        const password = generatePassword();
        
        const room = {
            code: roomCode,
            password: password,
            admin: socket.id,
            players: [{
                id: socket.id,
                name: playerName,
                isAdmin: true
            }],
            gameActive: false,
            currentRound: null
        };
        
        rooms.set(roomCode, room);
        socket.join(roomCode);
        socket.emit('roomCreated', {
            roomCode: roomCode,
            password: password,
            players: room.players,
            isAdmin: true
        });
        
        console.log(`Room created: ${roomCode} by ${playerName}`);
    });

    // Join room
    socket.on('joinRoom', (data) => {
        const { roomCode, playerName } = data;
        const room = rooms.get(roomCode);
        
        if (!room) {
            socket.emit('roomError', { message: 'ROOM NOT FOUND!' });
            return;
        }
        
        if (room.gameActive) {
            socket.emit('roomError', { message: 'GAME ALREADY IN PROGRESS!' });
            return;
        }
        
        if (room.players.length >= 12) {
            socket.emit('roomError', { message: 'ROOM IS FULL!' });
            return;
        }
        
        // Check if name already exists
        if (room.players.some(p => p.name === playerName)) {
            socket.emit('roomError', { message: 'NAME ALREADY TAKEN!' });
            return;
        }
        
        const isAdmin = socket.id === room.admin;
        room.players.push({
            id: socket.id,
            name: playerName,
            isAdmin: isAdmin
        });
        
        socket.join(roomCode);
        socket.emit('roomJoined', {
            roomCode: roomCode,
            password: room.password,
            players: room.players,
            isAdmin: isAdmin
        });
        
        // Notify other players
        socket.to(roomCode).emit('playerJoined', {
            players: room.players
        });
        
        console.log(`${playerName} joined room ${roomCode}`);
    });

    // Start game (admin only)
    socket.on('startGame', () => {
        const room = findRoomBySocket(socket.id);
        if (!room || room.admin !== socket.id) return;
        
        if (room.players.length < 4) {
            socket.emit('roomError', { message: 'NEED AT LEAST 4 PLAYERS!' });
            return;
        }
        
        if (room.gameActive) return;
        
        room.gameActive = true;
        startRound(room);
    });

    // Start a round
    function startRound(room) {
        const word = getRandomWord();
        const impostorIndex = Math.floor(Math.random() * room.players.length);
        const impostor = room.players[impostorIndex];
        
        room.currentRound = {
            word: word,
            impostor: impostor.name,
            startTime: Date.now()
        };
        
        // Send word to each player
        room.players.forEach((player, index) => {
            const isImpostor = index === impostorIndex;
            io.to(player.id).emit('gameStarted', {
                word: word,
                isImpostor: isImpostor
            });
        });
        
        // Start 10-second timer
        setTimeout(() => {
            endRound(room);
        }, 10000);
        
        console.log(`Round started in room ${room.code}, word: ${word}, impostor: ${impostor.name}`);
    }

    // End round
    function endRound(room) {
        if (!room.currentRound) return;
        
        const roundData = {
            word: room.currentRound.word,
            impostor: room.currentRound.impostor
        };
        
        io.to(room.code).emit('roundEnded', roundData);
        room.currentRound = null;
    }

    // Next round
    socket.on('nextRound', () => {
        const room = findRoomBySocket(socket.id);
        if (!room || room.admin !== socket.id || !room.gameActive) return;
        
        startRound(room);
    });

    // Back to lobby
    socket.on('backToLobby', () => {
        const room = findRoomBySocket(socket.id);
        if (!room || room.admin !== socket.id) return;
        
        room.gameActive = false;
        room.currentRound = null;
        io.to(room.code).emit('backToLobby', {
            players: room.players
        });
    });

    // Leave room
    socket.on('leaveRoom', () => {
        const room = findRoomBySocket(socket.id);
        if (room) {
            room.players = room.players.filter(p => p.id !== socket.id);
            
            // If admin left, assign new admin or close room
            if (room.admin === socket.id) {
                if (room.players.length > 0) {
                    room.admin = room.players[0].id;
                    room.players[0].isAdmin = true;
                } else {
                    rooms.delete(room.code);
                    console.log(`Room ${room.code} closed`);
                    return;
                }
            }
            
            socket.to(room.code).emit('playerLeft', {
                players: room.players
            });
            
            socket.leave(room.code);
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        const room = findRoomBySocket(socket.id);
        if (room) {
            room.players = room.players.filter(p => p.id !== socket.id);
            
            if (room.admin === socket.id) {
                if (room.players.length > 0) {
                    room.admin = room.players[0].id;
                    room.players[0].isAdmin = true;
                } else {
                    rooms.delete(room.code);
                    console.log(`Room ${room.code} closed`);
                    return;
                }
            }
            
            socket.to(room.code).emit('playerLeft', {
                players: room.players
            });
        }
        
        console.log('User disconnected:', socket.id);
    });

    // Helper function to find room by socket ID
    function findRoomBySocket(socketId) {
        for (const [code, room] of rooms.entries()) {
            if (room.players.some(p => p.id === socketId)) {
                return room;
            }
        }
        return null;
    }
});

// Start server
const PORT = process.env.PORT || 3001;

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.log(`Try using a different port: PORT=3002 npm start`);
        process.exit(1);
    } else {
        throw err;
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open this URL in your browser to play!`);
});
