// routes/puzzle.js

const express = require('express');
const router = express.Router();
const Puzzle = require('../models/puzzle');

router.get('/rating/:rating', async (req, res) => {
  const rating = req.params.rating;
  const puzzles = await Puzzle.getPuzzlesByRating(rating);
  res.json(puzzles);
});

router.get('/popularity/:popularity', async (req, res) => {
  const popularity = req.params.popularity;
  const puzzles = await Puzzle.getPuzzlesByPopularity(popularity);
  res.json(puzzles);
});
router.get('/random', async (req, res) => {
  try {
    const puzzle = await Puzzle.getRandomPuzzle(); // Call a method to get a random puzzle
    res.json(puzzle);
  } catch (error) {
    console.error('Error retrieving random puzzle:', error);
    res.status(500).json({ error: 'Error retrieving random puzzle' });
  }
});
router.get('/themes/:theme', async (req, res) => {
  const theme = req.params.theme;
  const puzzles = await Puzzle.getPuzzlesByTheme(theme);
  res.json(puzzles);
});
router.get('/filter/:popularity/:rating', async (req, res) => {
  try {
      const popularity = req.params.popularity;
      const rating = req.params.rating; // Récupérer la notation depuis les paramètres de requête
      const puzzles = await Puzzle.getPuzzlesByFilter(popularity, rating);
      console.log(popularity)// Passer les paramètres dans le bon ordre
      res.json(puzzles);
  } catch (error) {
      console.error('Erreur lors de la récupération des puzzles par filtre:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des puzzles par filtre' });
  }
});


module.exports = router;
