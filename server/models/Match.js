const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    team1: {
      type: String,
      required: true,
    },
    team2: {
      type: String,
      required: true,
    },
    winner: {
      type: String,
      required: true,
    },
    team1Score: {
      type: Number,
    },
    team2Score: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    venue: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
