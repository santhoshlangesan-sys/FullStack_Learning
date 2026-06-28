# Jaguars Cricket Club - Backend

## Overview
Backend API built with Express.js. Currently uses hard-coded data (MongoDB will be integrated later).

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env` (optional for now)

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID

### Players
- `GET /api/players` - Get all players
- `GET /api/players/team/:team` - Get players by team name

### Matches
- `GET /api/matches` - Get all matches

## Sample Data

The application currently includes hard-coded data for:
- **Teams:** Jaguars, Tigers, Panthers
- **Players:** Sample players with stats
- **Matches:** Recent match results

## MongoDB Integration

MongoDB will be integrated in the next phase. Currently all data is served from memory.

