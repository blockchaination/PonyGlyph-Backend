const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Ensure this model exists!

// ✅ Get All Bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
