import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { logos, videos } from '../../../assets';
import './Hero.scss';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación inicial
      const tl = gsap.timeline();
      
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      .from(logoRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5");

      // Parallax effect para el video
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleLogoClick = () => {
    navigate('/join');
  };

  return (
    <section ref={heroRef} className="hero-section">
      <div className="hero-bg">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="hero-video"
        >
          <source src={videos.mamadomain} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
      </div>
      
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          {t('home.hero.goldenBody')}<br/>
          {t('home.hero.goldenMind')}
        </h1>
        
        <div ref={logoRef} className="hero-logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <img src={logos.goldenEraAmarillo} alt="Golden Era" />
        </div>
      </div>
    </section>
  );
};

export default Hero;