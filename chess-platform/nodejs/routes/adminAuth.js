// // routes/adminAuth.js

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Check if admin exists
//   const admin = await User.findOne({ email, role: 'admin' });
//   if (!admin) {
//     return res.status(404).json({ message: 'Admin not found' });
//   }

//   // Verify password
//   if (!bcrypt.compareSync(password, admin.password)) {
//     return res.status(401).json({ message: 'Invalid password' });
//   }

//   // Generate JWT token
//   const token = jwt.sign({ email: admin.email, role: admin.role }, '123456');

//   res.json({ token });
// });

// module.exports = router;
