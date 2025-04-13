// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const connectedUsers = await User.find({ isLoggedIn: true });
    console.log('Connected users:', connectedUsers);
    res.json(connectedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
