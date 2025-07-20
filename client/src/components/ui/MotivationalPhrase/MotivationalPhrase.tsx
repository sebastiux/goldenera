import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './MotivationalPhrase.scss';

gsap.registerPlugin(ScrollTrigger);

const MotivationalPhrase: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="motivational-phrase">
      <div className="phrase-container">
        <div ref={textRef} className="phrase-text">
          <span className="text-white">{t('home.motivational.buildBody')}</span>
          {' '}
          <span className="text-golden">{t('home.motivational.becomeUntouchable')}</span>
        </div>
      </div>
    </section>
  );
};

export default MotivationalPhrase;