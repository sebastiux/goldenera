// client/src/pages/JoinClub/JoinClub.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import PricingPlans from '../../components/Pricing/PricingPlans';
import './JoinClub.scss';

gsap.registerPlugin(ScrollTrigger);

const JoinClub: React.FC = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          {
            opacity: 0,
            y: 100,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.2
          }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          {
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.5
          }
        );
      }

      // Background particles animation
      if (heroRef.current) {
        const particles = heroRef.current.querySelectorAll('.hero-particle');
        particles.forEach((particle, index) => {
          gsap.to(particle, {
            y: -30,
            x: Math.sin(index) * 20,
            rotation: 360,
            duration: 8 + Math.random() * 4,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 2
          });
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="join-club-page">
      {/* Hero Section */}
      <section className="join-hero" ref={heroRef}>
        <div className="join-hero__background">
          {/* Animated particles */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="hero-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}></div>
          ))}
        </div>

        <div className="join-hero__container">
          <div className="join-hero__content">
            <h1 className="join-hero__title" ref={titleRef}>
              <span className="title-pre">ÚNETE AL</span>
              <span className="title-main">CLUB ÉLITE</span>
              <span className="title-post">Solo para los que se atreven a ser legendarios</span>
            </h1>

            <p className="join-hero__subtitle" ref={subtitleRef}>
              Deja de ser invisible. Deja de ser promedio. Es hora de reclamar tu respeto y construir el cuerpo que refleje tu verdadero potencial. Solo 50 guerreros por año.
            </p>

            <div className="join-hero__stats">
              <div className="stat-item">
                <span className="stat-number">50</span>
                <span className="stat-label">Lugares Anuales</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Transformación</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0%</span>
                <span className="stat-label">Excusas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="join-hero__scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll para ver planes</span>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <PricingPlans />

      {/* Testimonial Section */}
      <section className="join-testimonial">
        <div className="join-testimonial__container">
          <div className="testimonial-content">
            <div className="testimonial-quote">
              <svg className="quote-icon" width="60" height="60" viewBox="0 0 24 24">
                <path fill="#EAC31B" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
              <p>
                "Golden Era no es solo un programa de fitness. Es una transformación completa de quién eres. Me enseñaron que mi cuerpo es mi primera tarjeta de presentación, y ahora comando respeto en cada habitación a la que entro."
              </p>
            </div>
            <div className="testimonial-author">
              <div className="author-info">
                <h4>Carlos Mendoza</h4>
                <span>CEO, Tech Startup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="join-final-cta">
        <div className="join-final-cta__container">
          <h2 className="final-cta-title">
            <span>¿Seguirás siendo invisible</span>
            <span className="golden-text">o te volverás imparable?</span>
          </h2>
          <p className="final-cta-text">
            Los débiles esperan. Los fuertes actúan. Los legendarios se unen a Golden Era.
          </p>
        </div>
      </section>
    </div>
  );
};

export default JoinClub;