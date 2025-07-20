import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import stripeService from '../../../services/stripeService';
import './JoinForm.scss';

gsap.registerPlugin(ScrollTrigger);

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.join-form-content > *', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validación
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Please fill all fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email');
      }

      // Crear sesión de Stripe
      const sessionId = await stripeService.createCheckoutSession({
        ...formData,
        priceId: process.env.REACT_APP_STRIPE_PRICE_ID || ''
      });

      // Redirigir a Stripe Checkout
      await stripeService.redirectToCheckout(sessionId);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="join-form-section">
      <div className="join-form-content">
        <div className="form-header">
          <h2 className="arabic-title" dir="rtl">الانضمام إلى النخبة</h2>
          <h2 className="section-title">{t('home.joinElite.title')}</h2>
          <p className="form-description">
            {t('home.joinElite.description')}
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="join-form">
          <input
            type="text"
            name="name"
            placeholder={t('home.joinElite.form.name')}
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="tel"
            name="phone"
            placeholder={t('home.joinElite.form.phone')}
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder={t('home.joinElite.form.email')}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : t('home.joinElite.form.submit')}
          </button>
        </form>
      </div>

      <div className="footer-section">
        <h2 className="footer-title">{t('home.followUs.title')}</h2>
        <p className="footer-description">
          {t('home.followUs.description')}
        </p>
        
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/82x50" alt="Facebook" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/84x41" alt="TikTok" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/82x53" alt="Instagram" />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/82x31" alt="WhatsApp" />
          </a>
        </div>

        <p className="copyright">
          {t('home.footer.rights')}
        </p>
      </div>
    </section>
  );
};

export default JoinForm;