import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './Testimonials.scss';

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (testimonialsRef.current) {
        const cards = Array.from(testimonialsRef.current.children);
        
        // Desktop: horizontal scroll
        if (window.innerWidth > 768) {
          gsap.to(cards, {
            xPercent: -100 * (cards.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: testimonialsRef.current,
              pin: true,
              scrub: 1,
              snap: 1 / (cards.length - 1),
              end: () => `+=${testimonialsRef.current?.offsetWidth}`
            }
          });
        } else {
          // Mobile: fade in animation
          gsap.from(cards, {
            y: 50,
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="testimonials-section">
      <div className="section-header">
        <h2 className="arabic-title">شهادات</h2>
        <h2 className="section-title">{t('home.testimonials.title')}</h2>
      </div>

      <div ref={testimonialsRef} className="testimonials-container">
        <div className="testimonial-card">
          <p className="testimonial-quote">
            {t('home.testimonials.tate.quote')}
          </p>
          <p className="testimonial-author">
            {t('home.testimonials.tate.author')}
          </p>
        </div>

        <div className="testimonial-card">
          <p className="testimonial-quote">
            {t('home.testimonials.amades.quote')}
          </p>
          <p className="testimonial-author">
            {t('home.testimonials.amades.author')}
          </p>
        </div>

        <div className="testimonial-card">
          <p className="testimonial-quote">
            {t('home.testimonials.goggins.quote')}
          </p>
          <p className="testimonial-author">
            {t('home.testimonials.goggins.author')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;