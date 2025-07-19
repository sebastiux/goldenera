import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './Partners.scss';

const Partners: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (partnersRef.current) {
        // Infinite scroll animation
        const partners = partnersRef.current.querySelector('.partners-track');
        if (partners) {
          const partnersClone = partners.cloneNode(true) as HTMLElement;
          partnersRef.current.appendChild(partnersClone);

          gsap.to([partners, partnersClone], {
            xPercent: -100,
            repeat: -1,
            duration: 20,
            ease: "none"
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="partners-section">
      <div className="section-header">
        <h2 className="arabic-title">شركاؤنا</h2>
        <h2 className="section-title">{t('home.partners.title')}</h2>
      </div>

      <div ref={partnersRef} className="partners-container">
        <div className="partners-track">
          <div className="partner-logo">
            <img src="https://placehold.co/144x72" alt="Partner 1" />
          </div>
          <div className="partner-logo">
            <img src="https://placehold.co/177x85" alt="Partner 2" />
          </div>
          <div className="partner-logo">
            <img src="https://placehold.co/91x72" alt="Partner 3" />
          </div>
          <div className="partner-logo">
            <img src="https://placehold.co/104x72" alt="Partner 4" />
          </div>
          <div className="partner-logo">
            <img src="https://placehold.co/96x72" alt="Partner 5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;