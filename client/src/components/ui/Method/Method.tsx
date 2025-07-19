import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './Method.scss';

const Method: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stepsRef.current) {
        const steps = Array.from(stepsRef.current.children);
        gsap.from(steps, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="method-section">
      <div className="container">
        <div className="method-header">
          <h2 className="arabic-title">طريقة العصر الذهبي</h2>
          <h2 className="section-title">{t('home.method.title')}</h2>
          <p className="method-description">
            {t('home.method.description')}
          </p>
        </div>

        <div ref={stepsRef} className="method-steps">
          <div className="method-step">
            <div className="step-icon">
              <img src="https://placehold.co/189x189" alt="Join" />
            </div>
            <div className="step-content">
              <h3>{t('home.method.steps.join.title')}</h3>
              <p>{t('home.method.steps.join.description')}</p>
            </div>
          </div>

          <div className="method-step">
            <div className="step-icon">
              <img src="https://placehold.co/230x230" alt="Use" />
            </div>
            <div className="step-content">
              <h3>{t('home.method.steps.use.title')}</h3>
              <p>{t('home.method.steps.use.description')}</p>
            </div>
          </div>

          <div className="method-step">
            <div className="step-icon">
              <img src="https://placehold.co/218x218" alt="Work" />
            </div>
            <div className="step-content">
              <h3>{t('home.method.steps.work.title')}</h3>
              <p>{t('home.method.steps.work.description')}</p>
            </div>
          </div>
        </div>

        <button className="cta-button">
          {t('home.method.cta')}
        </button>
      </div>
    </section>
  );
};

export default Method;