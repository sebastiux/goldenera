const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('🚀 Contact function started');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed', success: false })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('📥 Data received:', { name: data.name, email: data.email });

    // Validaciones básicas
    if (!data.name?.trim() || !data.email?.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Nombre y email son requeridos',
          success: false 
        })
      };
    }

    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Email inválido',
          success: false 
        })
      };
    }

    // Verificar configuración
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ Configuración SMTP faltante');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuración de email faltante',
          success: false 
        })
      };
    }

    const userData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || ''
    };

    console.log('📧 Creating transporter...');
    
    // Crear transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    // Templates simples
const userEmail = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center;">
      <h1 style="color: #000; margin: 0;">🏆 GOLDEN ERA 🏆</h1>
    </div>
    <div style="padding: 30px; background: white;">
      <h2>¡Hola ${userData.name}!</h2>
      <p style="font-size: 1.1rem; line-height: 1.6;">
        Gracias por tu interés en Golden Era. <strong>¡Tu transformación está a un click de distancia!</strong>
      </p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #FFD700;">
        <h3 style="color: #333; margin-top: 0;">🎯 Próximo paso:</h3>
        <p style="margin-bottom: 0;">Haz click en el botón de abajo para hablar directamente con nuestro equipo y conocer el programa perfecto para ti.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/5217202533388?text=%C2%A1Hola%21%20Soy%20${encodeURIComponent(userData.name)}%2C%20acabo%20de%20registrarme%20en%20Golden%20Era%20y%20quiero%20informaci%C3%B3n%20sobre%20los%20programas%20Golden%20Era%20%F0%9F%92%AA"
           style="background: #25D366; color: white; padding: 18px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 1.2rem; box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);">
          💬 HABLAR POR WHATSAPP AHORA
        </a>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.CLIENT_URL || 'https://goldenerademo.netlify.app'}
           style="background: transparent; color: #FFD700; padding: 12px 25px; text-decoration: none; border: 2px solid #FFD700; border-radius: 25px; font-weight: bold; display: inline-block; margin-top: 10px;">
          🌐 O ver programas en la web
        </a>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="margin: 0; color: #856404; font-weight: bold;">
          ⚡ Solo 50 cupos disponibles este año ⚡
        </p>
      </div>
      
      <p style="font-style: italic; color: #666; text-align: center; margin: 20px 0;">
        "Los débiles hacen excusas. Los fuertes hacen historia."
      </p>
    </div>
    <div style="background: #333; color: white; padding: 20px; text-align: center;">
      <p style="margin: 0;"><strong>GOLDEN ERA</strong> - Donde nacen los guerreros</p>
      <p style="margin: 5px 0 0 0;">
        📱 WhatsApp: +52 720 253 3388 | Instagram: @mateo.haces
      </p>
    </div>
  </div>
`;
    const adminEmail = `
      <div style="font-family: Arial, sans-serif;">
        <h2>🚨 NUEVO LEAD - GOLDEN ERA</h2>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
          <h3>Información del Lead</h3>
          <p><strong>Nombre:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Teléfono:</strong> ${userData.phone || 'No proporcionado'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        </div>
        <div style="background: #fff3cd; padding: 15px; margin: 15px 0;">
          <strong>ACCIÓN REQUERIDA:</strong> Contactar en las próximas 24 horas
        </div>
      </div>
    `;

    console.log('📤 Sending emails...');

    // Enviar email al usuario
    await transporter.sendMail({
      from: `"Golden Era Team" <${process.env.SMTP_USER}>`,
      to: userData.email,
      subject: '🏆 Bienvenido a Golden Era',
      html: userEmail,
    });

    // Enviar email al admin
    await transporter.sendMail({
      from: `"Golden Era System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🚨 NUEVO LEAD: ${userData.name}`,
      html: adminEmail,
    });

    console.log('✅ Emails sent successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Formulario enviado exitosamente'
      })
    };

  } catch (error) {
    console.error('❌ Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor'
      })
    };
  }
};