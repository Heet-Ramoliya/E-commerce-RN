require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).send({ error: 'Invalid amount provided' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: ['card'],
      amount: Math.round(amount),
      currency,
      capture_method: 'automatic',
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/refund-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).send({ error: 'Payment Intent ID is required' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    res
      .status(200)
      .send({ success: true, message: 'Refund successful', refund });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
