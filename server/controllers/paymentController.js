const stripe = require('../config/stripe');
const emailService = require('../services/emailService');

// Precios de los programas (en centavos)
const PROGRAM_PRICES = {
  basic: 9900, // $99.00
  premium: 19900, // $199.00
  elite: 29900 // $299.00
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { 
      customerEmail, 
      customerName, 
      customerPhone,
      programType,
      currency = 'usd' 
    } = req.body;

    // Validar datos
    if (!customerEmail || !customerName || !programType) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos' 
      });
    }

    // Obtener precio del programa
    const amount = PROGRAM_PRICES[programType];
    if (!amount) {
      return res.status(400).json({ 
        error: 'Tipo de programa inválido' 
      });
    }

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: {
        customerEmail,
        customerName,
        customerPhone: customerPhone || '',
        programType,
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100 // Devolver en dólares
    });
  } catch (error) {
    console.error('Error creando payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPrograms = async (req, res) => {
  // Devolver información de los programas
  res.json({
    programs: [
      {
        id: 'basic',
        name: 'Programa Básico',
        price: PROGRAM_PRICES.basic / 100,
        features: [
          'Plan de entrenamiento personalizado',
          'Seguimiento semanal',
          'Acceso a la comunidad'
        ]
      },
      {
        id: 'premium',
        name: 'Programa Premium',
        price: PROGRAM_PRICES.premium / 100,
        features: [
          'Todo lo del plan básico',
          'Plan nutricional personalizado',
          'Seguimiento 2 veces por semana',
          'Videollamadas mensuales'
        ]
      },
      {
        id: 'elite',
        name: 'Programa Elite',
        price: PROGRAM_PRICES.elite / 100,
        features: [
          'Todo lo del plan premium',
          'Entrenamiento 1-on-1',
          'Seguimiento diario',
          'Acceso prioritario al coach'
        ]
      }
    ]
  });
};