// client/src/pages/About/About.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './About.scss';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.querySelector('.hero-title'),
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.2,
            ease: "power3.out"
          }
        );

        gsap.fromTo(heroRef.current.querySelector('.hero-subtitle'),
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1,
            delay: 0.3,
            ease: "power3.out"
          }
        );
      }

      // Content sections animation
      contentRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(ref,
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Images parallax effect
      imageRefs.current.forEach((img, index) => {
        if (img) {
          gsap.fromTo(img,
            { y: 100, scale: 1.1 },
            {
              y: -50,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  const addToImageRefs = (el: HTMLImageElement) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  return (
    <div className="about-page" ref={sectionRef}>
      {/* Hero Section */}
      <section className="about-hero" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80" 
            alt="Dubai Skyline" 
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="golden-text">GOLDEN</span> ERA
          </h1>
          <p className="hero-subtitle">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="container">
          <div className="section-content" ref={addToRefs}>
            <div className="content-wrapper">
              <div className="text-content">
                <h2 className="section-title">
                  <span className="arabic-overlay">مهمتنا</span>
                  {t('about.mission.title')}
                </h2>
                <p className="section-text">
                  {t('about.mission.text')}
                </p>
                <div className="golden-line"></div>
              </div>
              <div className="image-content">
                <img 
                  src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80"
                  alt="Disciplined Training" 
                  className="static-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-section vision-section dark-section">
        <div className="container">
          <div className="section-content" ref={addToRefs}>
            <div className="content-wrapper reverse">
              <div className="text-content">
                <h2 className="section-title">
                  <span className="arabic-overlay">رؤيتنا</span>
                  {t('about.vision.title')}
                </h2>
                <p className="section-text">
                  {t('about.vision.text')}
                </p>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">50</span>
                    <span className="stat-label">
                      {t('about.vision.stats.elite')}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">0%</span>
                    <span className="stat-label">
                      {t('about.vision.stats.excuses')}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">
                      {t('about.vision.stats.transformation')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="image-content">
                <img 
                  ref={addToImageRefs}
                  src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80" 
                  alt="Power Training" 
                  className="section-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="container">
          <div className="section-content" ref={addToRefs}>
            <h2 className="section-title center">
              <span className="arabic-overlay">قيمنا</span>
              {t('about.values.title')}
            </h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">⚔️</div>
                <h3>{t('about.values.discipline.title')}</h3>
                <p>{t('about.values.discipline.text')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">👑</div>
                <h3>{t('about.values.excellence.title')}</h3>
                <p>{t('about.values.excellence.text')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔥</div>
                <h3>{t('about.values.transformation.title')}</h3>
                <p>{t('about.values.transformation.text')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💪</div>
                <h3>{t('about.values.leadership.title')}</h3>
                <p>{t('about.values.leadership.text')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Power Section */}
      <section className="about-section power-section">
  <div className="container">
    <div className="section-content" ref={addToRefs}>
      <div className="power-header">
        <h2 className="section-title center">
          <span className="arabic-decoration">القوة المطلقة</span>
          {t('about.power.title')}
        </h2>
        <p className="section-subtitle">
          {t('about.power.subtitle')}
        </p>
      </div>
      <div className="power-gallery">
        <div className="gallery-item">
          <img 
            ref={addToImageRefs}
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80" 
            alt="Intense Training" 
            className="gallery-image"
          />
        </div>
        <div className="gallery-item">
          <img 
            ref={addToImageRefs}
            src="https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=600&q=80" 
            alt="Champion Mindset" 
            className="gallery-image"
          />
        </div>
        <div className="gallery-item">
          <img 
            ref={addToImageRefs}
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80" 
            alt="Elite Performance" 
            className="gallery-image"
          />
        </div>
      </div>
    </div>
  </div>
</section>
      {/* CTA Section */}
      <section className="about-section cta-section">
        <div className="container">
          <div className="cta-content" ref={addToRefs}>
            <h2 className="cta-title">
              {t('about.cta.title')}
            </h2>
            <p className="cta-text">
              {t('about.cta.text')}
            </p>
            <button className="cta-button">
              {t('about.cta.button')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;