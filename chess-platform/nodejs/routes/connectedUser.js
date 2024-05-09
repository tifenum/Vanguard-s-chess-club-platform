// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route to get all logged in users
router.get('/users/connected', async (req, res) => {
  try {
    const connectedUsers = await User.find({ isLoggedIn: true });
    res.json(connectedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
