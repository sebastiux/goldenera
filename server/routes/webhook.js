const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const emailService = require('../services/emailService');

// Importante: Este endpoint debe usar express.raw()
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar eventos
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Pago exitoso:', paymentIntent.id);
      
      try {
        // Extraer datos del metadata
        const paymentData = {
          ...paymentIntent.metadata,
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id
        };

        // Enviar emails
        await emailService.sendConfirmationEmail(paymentData);
        await emailService.notifyAdminOfPurchase(paymentData);
      } catch (error) {
        console.error('Error procesando pago exitoso:', error);
        // Notificar al admin sobre el error
        await emailService.notifyPaymentError({
          error: error.message,
          ...paymentIntent.metadata
        });
      }
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Pago fallido:', failedPayment.id);
      
      // Notificar al admin sobre el intento fallido
      await emailService.notifyPaymentError({
        error: 'Intento de pago fallido',
        ...failedPayment.metadata
      });
      break;

    case 'charge.dispute.created':
      // Manejar disputas
      console.log('⚠️ Disputa creada');
      break;

    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;