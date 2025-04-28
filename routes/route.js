const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Employee = require('../models/Employee');
// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir); // Create the directory if it doesn't exist
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add unique filename
  },
});
const upload = multer({ storage: storage });

router.post('/signup', upload.single('image'), async (req, res) => {
  const { fullname, username, password, role } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ fullname, username, password, image, role: role || 'user' }); // Default to 'user' if no role provided
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user: { ...user._doc, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => { // Change '/api/auth/:id' to '/api/user/:id'
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
const bcrypt = require('bcrypt');

// Change Password
router.put('/change-password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if old password is correct
    const isMatch = user.password === oldPassword; // Replace with bcrypt compare if hashed
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    // Update password
    user.password = newPassword; // Hash it before saving
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// userRoutes.js

router.get('/role-count', async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(result);  

    const roleCounts = {
      admin: 0,
      user: 0,
      recruiter: 0
    };

    result.forEach(item => {
      const role = item._id?.toLowerCase();
      if (roleCounts.hasOwnProperty(role)) {
        roleCounts[role] = item.count;
      }
    });

    res.status(200).json(roleCounts);
  } catch (error) {
    console.error('Error fetching role counts:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post("/add-user", upload.single('image'), async (req, res) => {
  const { fullname, username, password, role } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ fullname, username, password, image, role: role || 'user' }); // Default to 'user' if no role provided
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/change-role/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {'('
    res.status(500).json({ message: "Server error", error });
  }
});


 


module.exports = router;