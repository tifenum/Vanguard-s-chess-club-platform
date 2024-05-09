const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChessGameSchema = new Schema({
    fen: {
        type: String,
        required: true
    },
});

const ChessMoveSchema = new Schema({
    move: {
        type: Object, 
        required: true
    },
    piece: {
        type: String,
    },
    color: {
        type: String,
    },
    x: {
        type: Boolean,
        default: false
    },
    check: {
        type: Boolean,
        default: false
    },
    stalemate: {
        type: Boolean,
        default: false
    },
    mate: {
        type: Boolean,
        default: false
    },
    checkmate: {
        type: Boolean,
        default: false
    },
    fen: {
        type: Object,
    },
    pgn: {
        type: Object,
        required: false
    },
    freeMode: {
        type: Boolean,
        default: false
    }
});

const ChessGame = mongoose.model('ChessGame', ChessGameSchema);

const ChessMove = mongoose.model('ChessMove', ChessMoveSchema);

module.exports = {
    ChessGame,
    ChessMove
};
