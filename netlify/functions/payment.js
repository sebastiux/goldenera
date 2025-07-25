const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  console.log('💳 Payment function called');

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('📝 Data received:', { 
      name: data.customerName, 
      email: data.customerEmail,
      program: data.programType 
    });

    // Validar datos requeridos
    if (!data.customerName || !data.customerEmail || !data.programType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Faltan datos requeridos' })
      };
    }

    const amount = data.programType === 'ultra-deluxe' ? 3500000 : 350000;
    console.log('💰 Amount:', amount, 'centavos MXN');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'mxn',
      metadata: {
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone || '',
        programType: data.programType,
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: { enabled: true }
    });

    console.log('✅ PaymentIntent created:', paymentIntent.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amount / 100
      })
    };

  } catch (error) {
    console.error('❌ Payment error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        type: error.type || 'unknown_error'
      })
    };
  }
};