const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// ✅ SIGNUP - Register a New User
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: "User registered successfully!", token, userId: user.id });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ LOGIN - Authenticate User & Return JWT Token
router.post('/login', [
    check('email', 'Include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, userId: user.id });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
