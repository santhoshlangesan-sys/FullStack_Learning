const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import models
const Team = require('./models/Team');
const Player = require('./models/Player');
const Match = require('./models/Match');

const app = express();

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jaguars-cricket';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Endpoint for external systems to POST events into this server
app.post('/api/events', (req, res) => {
  try {
    const { type, payload } = req.body || {}
    if (!type) return res.status(400).json({ error: 'Event type is required' })
    // Emit the event to all connected socket clients
    io.emit(type, payload || {})
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process event' })
  }
})

// Teams Routes
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teams' });
  }
});

app.get('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ error: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team' });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const { name, wins, losses } = req.body;

    // Validate input
    if (!name || wins === undefined || losses === undefined) {
      return res.status(400).json({ error: 'Name, wins, and losses are required' });
    }

    // Create new team
    const newTeam = new Team({
      name,
      wins: parseInt(wins),
      losses: parseInt(losses),
    });

    // Save to database
    const savedTeam = await newTeam.save();
    console.log('✅ Team Created:', JSON.stringify(savedTeam, null, 2));
    // Notify connected clients about the new team
    try { io.emit('team:created', savedTeam) } catch (e) { /* ignore */ }
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Error creating team' });
  }
});

// Players Routes
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching players' });
  }
});

app.get('/api/players/team/:team', async (req, res) => {
  try {
    const teamPlayers = await Player.find({ team: req.params.team });
    res.json(teamPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching players' });
  }
});

// Matches Routes
app.get('/api/matches', async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching matches' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id)
  socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id))
})

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
