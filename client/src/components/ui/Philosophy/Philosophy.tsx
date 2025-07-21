// client/src/components/ui/Philosophy/Philosophy.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Philosophy.scss';

gsap.registerPlugin(ScrollTrigger);

const Philosophy: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const elements = gsap.utils.toArray(content.children);
    
    elements.forEach((element, index) => {
      gsap.fromTo(element as Element,
        {
          y: 60,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element as Element,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="philosophy-section" ref={sectionRef}>
      <div className="container" ref={contentRef}>
        {/* Forge Your Legacy */}
        <div className="legacy-block">
          <div className="title-wrapper">
            <span className="arabic-overlay" aria-hidden="true">صياغة</span>
            <h2 className="section-title">FORGE YOUR</h2>
          </div>
          <div className="title-wrapper">
            <span className="arabic-overlay" aria-hidden="true">تراثك</span>
            <h2 className="section-title">LEGACY</h2>
          </div>
          <p className="section-description">
            {t('home.philosophy.legacy')}
          </p>
        </div>

        {/* Philosophy */}
        <div className="philosophy-block">
          <div className="title-wrapper">
            <span className="arabic-overlay" aria-hidden="true">فلسفة</span>
            <h2 className="section-title">{t('home.philosophy.philosophyTitle')}</h2>
          </div>
          <p className="section-description">
            {t('home.philosophy.text')}
          </p>
        </div>

        {/* CTA Button */}
        <button className="cta-button" aria-label="Begin your fitness journey">
          {t('home.philosophy.cta')}
        </button>
      </div>
    </section>
  );
};

export default Philosophy;