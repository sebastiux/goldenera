import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './JoinForm.scss';

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section ref={sectionRef} className="join-form-section">
      <div className="join-form-content">
        <div className="form-header">
          <h2 className="arabic-title">الانضمام إلى النخبة</h2>
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
          />
          <input
            type="tel"
            name="phone"
            placeholder={t('home.joinElite.form.phone')}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t('home.joinElite.form.email')}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">
            {t('home.joinElite.form.submit')}
          </button>
        </form>
      </div>

      <div className="footer-section">
        <h2 className="footer-title">{t('home.followUs.title')}</h2>
        <p className="footer-description">
          {t('home.followUs.description')}
        </p>
        
        <div className="social-links">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/82x50" alt="Social 1" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/84x41" alt="Social 2" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/82x53" alt="Social 3" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="https://placehold.co/82x31" alt="Social 4" />
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