import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import {
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import AddTeamForm from './AddTeamForm'

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
})

function App() {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [eventLog, setEventLog] = useState([])

  const fetchTeams = async () => {
    try {
      const teamsRes = await fetch('/api/teams')
      if (!teamsRes.ok) throw new Error('Failed to fetch teams')
      const teamsData = await teamsRes.json()
      setTeams(teamsData)
    } catch (err) {
      console.error('Error fetching teams:', err)
    }
  }

  const fetchPlayers = async () => {
    try {
      const playersRes = await fetch('/api/players')
      if (!playersRes.ok) throw new Error('Failed to fetch players')
      const playersData = await playersRes.json()
      setPlayers(playersData)
    } catch (err) {
      console.error('Error fetching players:', err)
    }
  }

  const fetchMatches = async () => {
    try {
      const matchesRes = await fetch('/api/matches')
      if (!matchesRes.ok) throw new Error('Failed to fetch matches')
      const matchesData = await matchesRes.json()
      setMatches(matchesData)
    } catch (err) {
      console.error('Error fetching matches:', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchTeams(), fetchPlayers(), fetchMatches()])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Socket.IO: listen for server-sent events (live updates)
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setEventLog(prev => [
        { id: Date.now(), type: 'info', message: 'Connected to live event stream' },
        ...prev,
      ].slice(0, 8))
    })

    socket.onAny((eventName, payload) => {
      const message = payload && typeof payload === 'object' && payload.name
        ? `Event ${eventName}: ${payload.name}`
        : `Event ${eventName}`
      setEventLog(prev => [
        { id: Date.now(), type: 'info', message },
        ...prev,
      ].slice(0, 8))
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setEventLog(prev => [
        { id: Date.now(), type: 'error', message: `Connection error: ${err.message}` },
        ...prev,
      ].slice(0, 8))
    })

    socket.on('disconnect', () => {
      setEventLog(prev => [
        { id: Date.now(), type: 'error', message: 'Disconnected from live event stream' },
        ...prev,
      ].slice(0, 8))
    })

    // New team created (from other clients or external systems)
    socket.on('team:created', (team) => {
      setTeams(prev => {
        if (!team || !team._id) return prev
        const exists = prev.some(t => t._id === team._id)
        return exists ? prev : [...prev, team]
      })

      setEventLog(prev => [
        { id: Date.now(), type: 'success', message: `Team received: ${team.name || 'Unknown team'}` },
        ...prev,
      ].slice(0, 8))
    })

    // Generic external events (for future use)
    socket.on('external-event', (payload) => {
      const msg = typeof payload === 'string' ? payload : JSON.stringify(payload)
      setEventLog(prev => [
        { id: Date.now(), type: 'info', message: `Event: ${msg}` },
        ...prev,
      ].slice(0, 8))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleTeamAdded = (newTeam) => {
    setTeams(prev => [...prev, newTeam])
  }

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">Error: {error}</Alert>
        </Container>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🏏 Jaguars Cricket Club
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Add Team Form */}
        <AddTeamForm onTeamAdded={handleTeamAdded} />

        {/* Event Log */}
        <Card sx={{ mb: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: '#667eea' }}>
              Live Event Log
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {eventLog.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Waiting for incoming events...
                </Typography>
              ) : (
                eventLog.map(item => (
                  <Box key={item.id} sx={{ p: 1.2, borderRadius: 1, backgroundColor: item.type === 'success' ? '#eefbf1' : '#f5f7ff' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.message}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Teams Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Teams
          </Typography>
          <Grid container spacing={2}>
            {teams.map(team => (
              <Grid item xs={12} sm={6} md={4} key={team._id}>
                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                      {team.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Wins:</strong> {team.wins}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Losses:</strong> {team.losses}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Players Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Players
          </Typography>
          <TableContainer component={Card} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#667eea' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Position</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stats</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map(player => (
                  <TableRow key={player._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>
                      {player.position === 'Batsman' || player.position === 'All-rounder'
                        ? `${player.runs || 0} runs`
                        : `${player.wickets || 0} wickets`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Matches Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Recent Matches
          </Typography>
          <Grid container spacing={2}>
            {matches.map(match => (
              <Grid item xs={12} sm={6} md={4} key={match._id}>
                <Card sx={{ height: '100%', boxShadow: 2, borderLeft: '4px solid #667eea', '&:hover': { boxShadow: 4 } }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      <strong>{match.team1}</strong> vs <strong>{match.team2}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Score: {match.team1Score} - {match.team2Score}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Winner:{' '}
                      <Box component="span" sx={{ backgroundColor: '#e8f4f8', color: '#667eea', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        {match.winner}
                      </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {new Date(match.date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
