# Jaguars Cricket Club - Full Stack Application

A modern full-stack web application for managing Jaguars Cricket Club operations.

## Tech Stack

- **Frontend:** React.js with Vite
- **Backend:** Node.js with Express
- **Database:** MongoDB (planned for phase 2)
- **HTTP Client:** Axios

## Project Structure

```
├── client/              # React frontend (Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/              # Node.js backend (Express)
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── package.json         # Root scripts
└── README.md            # This file
```

## Current Phase

**Phase 1: Hard-Coded Data** ✅ (Current)
- Backend serves hard-coded data (Teams, Players, Matches)
- Frontend displays data in interactive cards and tables
- No database integration yet

**Phase 2: MongoDB Integration** (Coming next)

## Setup Instructions

### 1. Install All Dependencies

```bash
npm run install-all
```

### 2. Run Development Servers

**Option A: Run both concurrently**
```bash
npm run dev
```

**Option B: Run separately in different terminals**

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev:client
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Endpoints:
  - GET `/api/health` - Health check
  - GET `/api/teams` - All teams
  - GET `/api/players` - All players
  - GET `/api/matches` - All matches

## Available Scripts

### Root Level
- `npm run install-all` - Install dependencies for all packages
- `npm run dev` - Run both client and server in development mode
- `npm run dev:server` - Run backend server only
- `npm run dev:client` - Run frontend only

### Backend (`server/`)
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload (requires nodemon)

### Frontend (`client/`)
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Features

- ✅ React frontend with Vite for fast development
- ✅ Express.js backend API with hard-coded data
- ✅ CORS enabled for frontend-backend communication
- ✅ API proxy configuration in Vite
- ✅ Teams, Players, and Matches display
- ✅ Responsive UI with modern styling

## Data Structure

### Teams
- ID, Name, Wins, Losses

### Players
- ID, Name, Team, Position, Stats (Runs for batsmen, Wickets for bowlers)

### Matches
- ID, Team1, Team2, Winner, Date

## Next Steps

1. Add more hard-coded data for teams, players, and matches
2. Set up MongoDB connection
3. Create data models and schemas
4. Migrate hard-coded data to database
5. Add CRUD operations for data management

## Troubleshooting

**Port already in use:** 
- Frontend (3000): `npm run dev:client -- --port 3001`
- Backend (5000): Update `PORT` in `server/.env`

**Backend won't start:** Ensure Node.js and npm are installed correctly
