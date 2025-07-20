import { loadStripe, Stripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutSessionData extends CustomerData {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

class StripeService {
  private stripe: Stripe | null = null;
  private readonly apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  async getStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  async createCheckoutSession(data: CheckoutSessionData): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/stripe/create-checkout-session`, {
        ...data,
        successUrl: data.successUrl || `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: data.cancelUrl || `${window.location.origin}/payment-cancel`,
        metadata: {
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone,
          timestamp: new Date().toISOString()
        }
      });
      
      return response.data.sessionId;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error('Stripe redirect error:', error);
      throw error;
    }
  }

  async retrieveSession(sessionId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/stripe/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving session:', error);
      throw error;
    }
  }
}

export default new StripeService();