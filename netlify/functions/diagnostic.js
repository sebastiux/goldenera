exports.handler = async (event, context) => {
  console.log('🔍 Diagnostic function called');
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? 
        process.env.STRIPE_SECRET_KEY.substring(0, 8) + '...' : 'MISSING',
      method: event.httpMethod,
      site: 'goldenerademo.netlify.app',
      message: '✅ Diagnostic function working correctly!'
    })
  };
};