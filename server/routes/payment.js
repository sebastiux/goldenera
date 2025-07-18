const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Obtener información de programas
router.get('/programs', paymentController.getPrograms);

// Crear intención de pago
router.post('/create-payment-intent', paymentController.createPaymentIntent);

module.exports = router;