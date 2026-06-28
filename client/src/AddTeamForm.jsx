import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Grid,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material'

function AddTeamForm({ onTeamAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    wins: '',
    losses: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Validate inputs
      if (!formData.name.trim()) {
        throw new Error('Team name is required')
      }
      if (formData.wins === '' || formData.losses === '') {
        throw new Error('Wins and losses are required')
      }
      if (isNaN(formData.wins) || isNaN(formData.losses)) {
        throw new Error('Wins and losses must be numbers')
      }

      // Send to backend
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          wins: parseInt(formData.wins),
          losses: parseInt(formData.losses),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add team')
      }

      const newTeam = await response.json()
      setMessage({ type: 'success', text: `Team "${newTeam.name}" added successfully!` })

      // Clear form
      setFormData({ name: '', wins: '', losses: '' })

      // Notify parent component to refresh teams
      onTeamAdded(newTeam)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
          Add New Teamssss
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Team Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter team name"
              disabled={loading}
              variant="outlined"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="wins"
                  name="wins"
                  label="Wins"
                  type="number"
                  value={formData.wins}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="losses"
                  name="losses"
                  label="Losses"
                  type="number"
                  value={formData.losses}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {message.text && (
              <Alert severity={message.type === 'success' ? 'success' : 'error'}>
                {message.text}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                padding: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#667eea',
                '&:hover': {
                  backgroundColor: '#5568d3',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  Adding...
                </Box>
              ) : (
                'Add Team'
              )}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AddTeamForm
