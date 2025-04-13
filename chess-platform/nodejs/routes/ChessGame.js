
const express = require("express");
const { ChessGame, ChessMove } = require("../models/ChessGame");
// const tf = require("@tensorflow/tfjs-node");
const { Chess } = require("chess.js");
const router = express.Router();
router.post("/save-game", async (req, res) => {
    try {
      const { move } = req.body;
      const newChessMove = new ChessMove({
        move,
      });

      await newChessMove.save();
      res.status(200).json({ message: "Game saved successfully" });
    } catch (error) {
      console.error("Error saving game:", error);
      res.status(500).send("Internal Server Error");
    }
  });
module.exports = function (model) {
  const router = express.Router();

  router.post("/predict", async (req, res) => {
    try {
      console.log("Predicting move...");
      const { fen } = req.body;
      const chess = new Chess(fen);
      const moves = chess.moves();
      console.log(moves);

      let bestScore = -Infinity;
      let bestMove = null;
      for (const move of moves) {
        // Create a new FEN string for this move
        chess.move(move);
        const newFen = chess.fen();
        // Score the new FEN string
        const score = await predictWithModel(model, newFen);
        // If this move has a better score, remember it
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
        // Undo the move to restore the original board state
        chess.undo();
      }

      console.log("Best move:", bestMove);
      res.status(200).json({ bestMove });
    } catch (error) {
      console.error("Error predicting move:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  async function predictWithModel(model, fen) {
    // Process the FEN data as needed
    const inputData = fenToOneHot2DArray(fen);
    const reshapedInputData = tf.tensor4d(inputData, [1, 8, 8, 13]);
    const prediction = model.predict(reshapedInputData);
    const predictionData = await prediction.array();
    return predictionData[0][0]; // Return the score as a single number
  }
  function fenToOneHot2DArray(fen) {
    const pieceMap = {
      r: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      n: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      b: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      q: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      k: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      p: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      R: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      N: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      B: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      Q: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      K: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      P: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    ".": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    };

    const board = fen.split(" ")[0];
    const rows = board.split("/");
    const arr = rows.map((row) => {
      const rowArr = [];
      for (let char of row) {
        if (isNaN(char)) {
          // if the character is not a number
          rowArr.push(...pieceMap[char]);
        } else {
          // if the character is a number
          for (let i = 0; i < parseInt(char); i++) {
            rowArr.push(...pieceMap["."]);
          }
        }
      }
      return rowArr;
    });

    return arr.flat();
  }
  return router;
};

