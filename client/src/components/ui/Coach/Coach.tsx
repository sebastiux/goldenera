import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { images } from '../../../assets';
import './Coach.scss';

gsap.registerPlugin(ScrollTrigger);

const Coach: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      });

      gsap.from('.coach-info > *', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="coach-section">
      <div className="container">
        <h2 className="section-title">{t('home.coach.title')}</h2>
        
        <div ref={contentRef} className="coach-container">
          <div ref={imageRef} className="coach-image">
            <img src="https://placehold.co/314x524" alt="Mario H" />
          </div>
          
          <div className="coach-info">
            <h3 className="coach-name">{t('home.coach.name')}</h3>
            <p className="coach-description">
              {t('home.coach.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coach;