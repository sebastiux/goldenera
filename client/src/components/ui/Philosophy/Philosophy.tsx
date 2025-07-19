import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './Philosophy.scss';

const Philosophy: React.FC = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const arabicRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(arabicRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

      // Animar children de forma segura
      if (contentRef.current) {
        const children = Array.from(contentRef.current.children);
        tl.from(children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out"
        }, "-=0.4");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="philosophy-section">
      <div className="container">
        <div className="philosophy-header">
          <h2 ref={arabicRef} className="arabic-title">صياغة تراثك</h2>
          <h2 ref={titleRef} className="section-title">
            {t('home.philosophy.forgeYourLegacy')}
          </h2>
        </div>
        
        <div ref={contentRef} className="philosophy-content">
          <p className="philosophy-text">
            {t('home.philosophy.legacy')}
          </p>
          
          <div className="philosophy-divider">
            <h2 className="arabic-title">فلسفة</h2>
            <h2 className="section-title">{t('home.philosophy.philosophyTitle')}</h2>
          </div>
          
          <p className="philosophy-text">
            {t('home.philosophy.text')}
          </p>
          
          <button className="cta-button">
            {t('home.philosophy.cta')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;