// Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Autres champs de la partie
});

module.exports = mongoose.model('Game', gameSchema);
