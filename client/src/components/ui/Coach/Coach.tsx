// client/src/components/ui/Coach/Coach.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { images } from '../../../assets';
import './Coach.scss';

gsap.registerPlugin(ScrollTrigger);

const Coach: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const title = titleRef.current;

    if (!section || !image || !content || !title) return;

    // Timeline principal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Animación del título con efecto de poder
    tl.fromTo(title,
      {
        scale: 0.5,
        opacity: 0,
        rotationX: 90
      },
      {
        scale: 1,
        opacity: 1,
        rotationX: 0,
        duration: 1.2,
        ease: "power4.out"
      }
    );

    // Animación de la imagen con efecto de entrada potente
    tl.fromTo(image,
      {
        scale: 1.3,
        opacity: 0,
        filter: "blur(10px)"
      },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out"
      },
      "-=0.8"
    );

    // Efecto de brillo en la imagen
    tl.to(image, {
      duration: 2,
      ease: "power2.inOut",
      "--glow": "1",
      repeat: -1,
      yoyo: true
    }, "-=1");

    // Animación del contenido
    tl.fromTo(content.children,
      {
        y: 30,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      },
      "-=0.5"
    );

    // Efecto parallax en la imagen
    gsap.to(image, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

    // Efecto hover en la imagen para desktop
    const handleMouseMove = (e: MouseEvent) => {
      const rect = image.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(image, {
        rotationY: x * 10,
        rotationX: -y * 10,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    if (window.innerWidth > 768) {
      image.addEventListener('mousemove', handleMouseMove);
      image.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (window.innerWidth > 768) {
        image.removeEventListener('mousemove', handleMouseMove);
        image.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="coach-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title" ref={titleRef}>
          {t('home.coach.title')}
        </h2>
        
        <div className="coach-container">
          <div className="coach-image" ref={imageRef}>
            <div className="image-glow"></div>
            <img src={images.coach} alt={t('home.coach.name')} />
            <div className="power-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div className="coach-info" ref={contentRef}>
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