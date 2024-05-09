const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import the User model defined in your application
const User = require('../models/user');

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/chess', { useNewUrlParser: true, useUnifiedTopology: true });

// Create an admin user
async function createAdmin() {
    try {
        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash the admin password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456789', salt);

        // Create the admin user
        const admin = new User({
            name: 'Admin',
            email: 'nermineagili@gmail.com',
            password: 123456789,
            role: 'admin'
        });

        // Save the admin user to the database
        await admin.save();

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        // Disconnect from the database after completing the operation
        mongoose.disconnect();
    }
}

// Call the createAdmin function to create the admin user
createAdmin();
