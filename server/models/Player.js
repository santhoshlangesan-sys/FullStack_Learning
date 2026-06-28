const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
      required: true,
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    jerseyNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);
