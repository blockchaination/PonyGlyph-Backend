const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ✅ Create Payment Intent
router.post('/', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ error: "Amount and currency are required" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('❌ Stripe Payment Error:', error);
        res.status(500).json({ error: error.message || 'Payment failed' });
    }
});

module.exports = router;
