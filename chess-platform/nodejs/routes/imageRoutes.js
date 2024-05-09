// imageRoutes.js or imageRoutes.ts

const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure Multer to specify where to store uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Define the route to handle image upload
router.post('/saveImage', upload.single('image'), (req, res) => {
  try {
    const imageUrl = 'http://localhost:3000/' + req.file.path;
    res.status(200).json({ imageURL: imageUrl });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
