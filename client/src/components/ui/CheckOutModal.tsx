import React, { useState } from 'react';
import Modal from 'react-modal';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { paymentAPI } from '../../services/api';
import { Program } from '../../types';
import '../../styles/checkout-modal.scss';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface CheckoutFormProps {
  program: Program;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ program, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Crear payment intent
      const { clientSecret } = await paymentAPI.createPaymentIntent(program.id);

      // Confirmar el pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name,
            email,
          },
        },
      });

      if (result.error) {
        onError(result.error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (error) {
      onError('Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h3>{program.name}</h3>
      <p className="price">${program.price}</p>
      
      <div className="form-group">
        <label>{t('payment.name')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>{t('payment.email')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>{t('payment.card')}</label>
        <div className="card-element">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="submit-button"
      >
        {isProcessing ? t('payment.processing') : t('payment.checkout')}
      </button>
    </form>
  );
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, program }) => {
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
    }, 3000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  if (!program) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="checkout-modal"
      overlayClassName="checkout-overlay"
    >
      {showSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>{t('payment.success')}</h2>
          <p>{t('payment.confirmationEmail')}</p>
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            program={program} 
            onSuccess={handleSuccess}
            onError={handleError}
          />
          {error && <div className="error-message">{error}</div>}
        </Elements>
      )}
    </Modal>
  );
};

export default CheckoutModal;