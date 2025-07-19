import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './GuaranteedResults.scss';

const GuaranteedResults: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const children = Array.from(contentRef.current.children);
        gsap.from(children, {
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="guaranteed-results-section">
      <div ref={contentRef} className="results-content">
        <h2 className="arabic-title">نتائج مضمونة</h2>
        <h2 className="section-title">
          {t('home.results.guaranteed')}<br/>
          {t('home.results.guaranteedLine2')}
        </h2>
        <p className="results-text">
          {t('home.results.text')}
        </p>
      </div>
    </section>
  );
};

export default GuaranteedResults;