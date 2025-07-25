const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
  console.log('🔔 Webhook iniciado:', event.httpMethod);

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
    let stripeEvent;
    const sig = event.headers['stripe-signature'];

    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      try {
        stripeEvent = stripe.webhooks.constructEvent(
          event.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('❌ Signature verification failed:', err.message);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid signature' })
        };
      }
    } else {
      console.warn('⚠️ Sin verificación de signature');
      stripeEvent = JSON.parse(event.body);
    }

    console.log('📨 Evento recibido:', stripeEvent.type);
    console.log('📊 Event object ID:', stripeEvent.data.object.id);

    // Manejar payment_intent.succeeded (lo que queremos)
    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object;
      console.log('💰 PAGO EXITOSO - Payment Intent:', paymentIntent.id);
      
      await processSuccessfulPayment(paymentIntent);
    }
    
    // Manejar setup_intent.succeeded (para pagos futuros)
    else if (stripeEvent.type === 'setup_intent.succeeded') {
      const setupIntent = stripeEvent.data.object;
      console.log('🔧 Setup Intent succeeded:', setupIntent.id);
      
      // Si tiene metadata de customer, procesar como pago
      if (setupIntent.metadata && setupIntent.metadata.customerName) {
        console.log('💰 Procesando Setup Intent como pago completado');
        
        // Crear objeto similar a PaymentIntent para compatibilidad
        const paymentData = {
          id: setupIntent.id,
          amount: setupIntent.metadata.programType === 'ultra-deluxe' ? 3500000 : 350000,
          metadata: setupIntent.metadata
        };
        
        await processSuccessfulPayment(paymentData);
      }
    }
    
    // Manejar otros eventos comunes
    else if (stripeEvent.type === 'payment_intent.created') {
      console.log('📝 Payment Intent creado:', stripeEvent.data.object.id);
    }
    
    else if (stripeEvent.type === 'setup_intent.created') {
      console.log('🔧 Setup Intent creado:', stripeEvent.data.object.id);
    }
    
    else {
      console.log('📋 Evento no manejado:', stripeEvent.type);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true, type: stripeEvent.type })
    };

  } catch (error) {
    console.error('❌ Error general en webhook:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        received: true, 
        error: 'Processing error logged' 
      })
    };
  }
};

// Función para procesar pagos exitosos
async function processSuccessfulPayment(paymentObject) {
  console.log('🎯 Procesando pago exitoso para:', paymentObject.metadata.customerName);
  
  const customerData = {
    name: paymentObject.metadata.customerName,
    email: paymentObject.metadata.customerEmail,
    phone: paymentObject.metadata.customerPhone || '',
    program: paymentObject.metadata.programType,
    amount: paymentObject.amount,
    paymentId: paymentObject.id,
    timestamp: paymentObject.metadata.timestamp || new Date().toISOString()
  };

  console.log('📧 Preparando emails para:', customerData.email);

  try {
    await Promise.race([
      sendConfirmationEmails(customerData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout')), 15000)
      )
    ]);
    console.log('✅ Emails enviados exitosamente');
  } catch (emailError) {
    console.error('⚠️ Error en emails (no crítico):', emailError.message);
  }
}

async function sendConfirmationEmails(customerData) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log('⚠️ Credenciales de email no configuradas');
    throw new Error('Email credentials missing');
  }

  console.log('📧 Creando transportador SMTP...');
  
  // ✅ CORREGIR: createTransport (no createTransporter)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  // Verificar conexión SMTP
  try {
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');
  } catch (error) {
    console.error('❌ Error de conexión SMTP:', error.message);
    throw error;
  }

  const programInfo = {
    'ultra-deluxe': { 
      name: 'Golden Era Ultra Deluxe', 
      price: '$35,000 MXN', 
      duration: '6 meses' 
    },
    'golden-standard': { 
      name: 'Golden Era Standard', 
      price: '$3,500 MXN', 
      duration: '3 meses' 
    }
  };

  const program = programInfo[customerData.program] || programInfo['golden-standard'];

  // Email al cliente
  const clientEmail = {
    from: process.env.EMAIL_USER,
    to: customerData.email,
    subject: '🏆 ¡Bienvenido a Golden Era! Tu transformación comienza ahora',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
        <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center;">
          <h1 style="color: #000; margin: 0; font-size: 28px;">🏆 BIENVENIDO A GOLDEN ERA 🏆</h1>
          <h2 style="color: #333; margin: 10px 0 0 0; font-size: 18px;">Tu transformación comienza ahora</h2>
        </div>
        
        <div style="padding: 30px;">
          <h3>¡Hola ${customerData.name}!</h3>
          <p>Felicidades por dar el primer paso hacia tu transformación. Has adquirido:</p>
          
          <div style="background: #f9f9f9; border-left: 4px solid #FFD700; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${program.name}</h3>
            <p><strong>💰 Inversión:</strong> ${program.price}</p>
            <p><strong>⏱️ Duración:</strong> ${program.duration}</p>
            <p><strong>📅 Fecha:</strong> ${new Date().toLocaleDateString('es-MX')}</p>
            <p><strong>🆔 ID:</strong> ${customerData.paymentId}</p>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404; margin: 0 0 10px 0;">🚀 ¿Qué sigue ahora?</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li><strong>Próximas 2 horas:</strong> Un coach te contactará</li>
              <li><strong>24 horas:</strong> Acceso a tu área personal</li>
              <li><strong>Esta semana:</strong> Evaluación inicial</li>
            </ul>
          </div>

          <p style="text-align: center;">
            <a href="https://www.instagram.com/golden.era" style="background: #FFD700; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              📱 SÍGUENOS EN INSTAGRAM
            </a>
          </p>
        </div>
        
        <div style="background: #000; color: #FFD700; text-align: center; padding: 20px;">
          <h3>Golden Era - Transforma tu cuerpo, transforma tu vida</h3>
          <p>Instagram: @golden.era | Email: info@goldenera.mx</p>
        </div>
      </div>
    `
  };

  // Email al equipo
  const teamEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.TEAM_EMAIL || process.env.EMAIL_USER,
    subject: `🚨 NUEVA VENTA - ${program.name} - ${customerData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
        <div style="background: #000; color: #FFD700; text-align: center; padding: 20px;">
          <h1>🚨 NUEVA VENTA CONFIRMADA 🚨</h1>
        </div>
        
        <div style="padding: 30px;">
          <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>✅ PAGO EXITOSO - ${program.price}</strong>
          </div>
          
          <h3>📋 Cliente: ${customerData.name}</h3>
          <ul>
            <li><strong>Email:</strong> ${customerData.email}</li>
            <li><strong>Teléfono:</strong> ${customerData.phone || 'No proporcionado'}</li>
            <li><strong>Programa:</strong> ${program.name}</li>
            <li><strong>Payment ID:</strong> ${customerData.paymentId}</li>
            <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</li>
          </ul>

          <div style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>🚨 CONTACTAR AL CLIENTE EN LAS PRÓXIMAS 2 HORAS</strong>
          </div>
        </div>
      </div>
    `
  };

  console.log('📤 Enviando email al cliente:', customerData.email);
  await transporter.sendMail(clientEmail);
  
  console.log('📤 Enviando email al equipo:', process.env.TEAM_EMAIL);
  await transporter.sendMail(teamEmail);
  
  console.log('✅ Todos los emails enviados exitosamente');
}