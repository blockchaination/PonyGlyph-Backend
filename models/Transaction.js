const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);

