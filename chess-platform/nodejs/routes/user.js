// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../authenticateToken');
const multer = require('multer'); // Add this line to require multer
let filename = '';

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        let date = Date.now();
        let fl = date + '.' + file.originalname.split('.')[1];
        callback(null, fl);
        filename = filename ? filename + ',' + fl : fl;
    },
});

const upload = multer({ storage: storage });

router.post('/register',upload.single('attachments'), async (req, res) => {
    try {
        const data = req.body;
        if (!data.name || !data.email || !data.password) {
            return res.status(400).send("Missing required fields");
        }
        
        const salt = bcrypt.genSaltSync(10);
        const cryptedpass = bcrypt.hashSync(data.password, salt);
        
        // Set the role based on the role data sent from the frontend
        const role = data.role || 'user'; // Default to 'user' if role data is not provided
        
        const newUser = new User({
            name: data.name,
            lastname: data.lastname,
            email: data.email,
            password: cryptedpass,
            chess : data.chess,
            role: role // Set the role based on the request data
        });
        newUser.attachments = filename;
        console.log(newUser);
        const savedUser = await newUser.save();
        res.status(200).send(savedUser);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});


// In your backend login route handler

router.post("/login", (req, res) => {
    let data = req.body;
    User.findOne({ email: data.email })
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        const validPass = bcrypt.compareSync(data.password, user.password);
        if (!validPass) {
          return res.status(401).send("Invalid password");
        }
  
        // Mettre à jour la variable isLoggedIn à true
        user.isLoggedIn = true;
        // Enregistrer les modifications dans la base de données
        user.save();
  
        const payload = {
          _id: user._id,
          email: user.email,
          fullname: user.name + " " + user.lastname,
          role: user.role, // Include the user's role in the payload
        };
  
        const token = jwt.sign(payload, "admin");
  
        res.status(200).send({ user: payload, token: token });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  });



router.get('/getAllUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getbyid/:id', (req, res) => {
    const myid = req.params.id; // Fix typo here, change 'myid' to 'const myid'
    User.findOne({ _id: myid })
        .then((user) => {
            res.send(user.name + ' ' + user.lastname);
        })
        .catch((err) => {
            res.send(err);
            console.log(err);
        });
});

// Protected route that requires authentication
router.get('/protected-route', authenticateToken, (req, res) => {
    res.send('You have access to this protected route!');
});

// router.post('/saveImage', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user._id; // Get the user ID from the authenticated user
//         const imageData = req.body.image; // Assuming the image data is sent in the request body

//         // Update the user document with the image URL
//         await User.findByIdAndUpdate(userId, { image: imageData });

//         res.status(200).json({ message: 'Image saved successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// router.get('/userData', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user._id; // Get the user ID from the authenticated user

//         // Fetch the user document from the database
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


router.get('/userData', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the authenticated user

        // Fetch the user document from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract relevant user data including the image
        const userData = {
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            chess: user.chess,
            role: user.role,
            // image: user.attachments ? `${user.attachments}` : null,
            attachments: user.attachments ? `${user.attachments}` : null
        };

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put("/users/:userId/logout", authenticateToken, async (req, res) => {
    try {
      const userId = req.params.userId;
      await User.findByIdAndUpdate(userId, { isLoggedIn: false });
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.get('/getUserById/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
       
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});








module.exports = router;
