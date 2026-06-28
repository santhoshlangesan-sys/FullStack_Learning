const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    founded: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
