import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './WhyItWorks.scss';

const WhyItWorks: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children);
        gsap.from(cards, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
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

  const handleCardClick = (index: number) => {
    setActiveCard(activeCard === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="why-it-works-section">
      <div className="container">
        <div className="section-header">
          <h2 className="arabic-title">لماذا يعمل</h2>
          <h2 className="section-title">{t('home.whyItWorks.title')}</h2>
          <p className="section-description">
            {t('home.whyItWorks.description')}
          </p>
          <p className="click-instruction">
            {t('home.whyItWorks.clickCards')}
          </p>
        </div>

        <div ref={cardsRef} className="cards-container">
          <div 
            className={`work-card ${activeCard === 0 ? 'active' : ''}`}
            onClick={() => handleCardClick(0)}
          >
            <div className="card-image">
              <img src="https://placehold.co/279x279" alt="Exercises" />
            </div>
            <h3 className="card-title">
              {t('home.whyItWorks.cards.exercises')}
            </h3>
          </div>

          <div 
            className={`work-card ${activeCard === 1 ? 'active' : ''}`}
            onClick={() => handleCardClick(1)}
          >
            <div className="card-image">
              <img src="https://placehold.co/279x279" alt="Adaptable" />
            </div>
            <h3 className="card-title">
              {t('home.whyItWorks.cards.adaptable')}
            </h3>
          </div>

          <div 
            className={`work-card ${activeCard === 2 ? 'active' : ''}`}
            onClick={() => handleCardClick(2)}
          >
            <div className="card-image">
              <img src="https://placehold.co/279x279" alt="Monitor" />
            </div>
            <h3 className="card-title">
              {t('home.whyItWorks.cards.monitor')}
            </h3>
          </div>
        </div>

        <div className="motivational-banner">
          <p>
            <span className="white-text">{t('home.motivational.buildBody')}</span>
            {' '}
            <span className="golden-text">{t('home.motivational.becomeUntouchable')}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyItWorks;