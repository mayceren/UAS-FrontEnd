const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = 'your-secret-key'; // Ganti dengan secret key yang lebih aman

// Register user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', user_id: user._id, token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login', details: err.message });
  }
};

module.exports = { register, login };
