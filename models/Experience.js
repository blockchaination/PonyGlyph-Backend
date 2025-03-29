const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    availableDates: [{ type: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
