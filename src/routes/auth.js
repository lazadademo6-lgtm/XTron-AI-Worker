const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered successfully');
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

// Google OAuth (placeholder)
router.post('/auth/google', async (req, res) => {
    // Handle Google OAuth logic
    res.send('Google OAuth not implemented yet');
});

// Verify Token
router.get('/verify', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.sendStatus(403);
        res.json({ userId: decoded.id });
    });
});

// Logout (placeholder)
router.post('/logout', (req, res) => {
    // Handle logout logic; typically involves client-side actions
    res.send('Logged out successfully');
});

// Retrieve Profile
router.get('/profile', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const user = await User.findById(decoded.id);
        res.json({ email: user.email });
    });
});

module.exports = router;