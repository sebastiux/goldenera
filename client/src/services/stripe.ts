// client/src/services/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

// Crear UNA SOLA instancia de Stripe para toda la app
export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');
