import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import GoldenEraAmarillo from '../../../assets/logos/GoldenEra_Amarillo.png';
import GoldenEraBlanco from '../../../assets/logos/GoldenEra_Blanco.png';
import './AnimatedLogo.scss';

const AnimatedLogo: React.FC = () => {
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoWhiteRef = useRef<HTMLImageElement>(null);
  const logoYellowRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!logoContainerRef.current || !logoWhiteRef.current || !logoYellowRef.current) return;

    // Timeline para la animación agresiva estilo Nike
    const tl = gsap.timeline({ delay: 0.3 });

    // Estado inicial - ambos logos en la misma posición
    gsap.set([logoWhiteRef.current, logoYellowRef.current], {
      scale: 0.6,
    });
    
    gsap.set(logoYellowRef.current, {
      opacity: 0,
    });

    gsap.set(logoWhiteRef.current, {
      opacity: 1,
    });

    // Animación agresiva
    tl
      // Ambos logos crecen juntos
      .to([logoWhiteRef.current, logoYellowRef.current], {
        scale: 1.1,
        duration: 0.5,
        ease: "power4.out",
      })
      .to([logoWhiteRef.current, logoYellowRef.current], {
        scale: 1,
        duration: 0.2,
        ease: "power2.in",
      })
      // Pausa dramática
      .to({}, { duration: 0.3 })
      // Cambio de color explosivo (sin mover posición)
      .to(logoWhiteRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      })
      .to(logoYellowRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      }, "-=0.2")
      // Efecto de brillo potente aparece
      .set(logoYellowRef.current, {
        filter: 'drop-shadow(0 0 40px #FFEB37) drop-shadow(0 0 80px #FFEB37)',
      })
      .to(logoYellowRef.current, {
        filter: 'drop-shadow(0 0 20px #FFEB37) drop-shadow(0 0 40px #FFEB37) drop-shadow(0 0 60px rgba(255, 235, 55, 0.6))',
        duration: 0.3,
        ease: "power2.out",
      })
      // Flash de brillo
      .to(logoYellowRef.current, {
        filter: 'drop-shadow(0 0 30px #FFEB37) drop-shadow(0 0 60px #FFEB37) drop-shadow(0 0 90px rgba(255, 235, 55, 0.8))',
        duration: 0.15,
        ease: "power2.in",
      })
      // Estabilización con brillo persistente
      .to(logoYellowRef.current, {
        filter: 'drop-shadow(0 0 15px #FFEB37) drop-shadow(0 0 30px rgba(255, 235, 55, 0.7))',
        duration: 0.3,
        ease: "power2.out",
      })
      // Pulso final del container (ambos logos se mueven juntos)
      .to(logoContainerRef.current, {
        scale: 1.08,
        duration: 0.15,
        ease: "power4.out",
      })
      .to(logoContainerRef.current, {
        scale: 1,
        duration: 0.15,
        ease: "power2.inOut",
      })
      // Brillo final estable
      .to(logoYellowRef.current, {
        filter: 'drop-shadow(0 0 12px #FFEB37) drop-shadow(0 0 25px rgba(255, 235, 55, 0.6))',
        duration: 0.4,
        ease: "power2.out",
      }, '-=0.15');

  }, []);

  return (
    <div className="animated-logo-container">
      <div ref={logoContainerRef} className="logo-wrapper">
        <img 
          ref={logoWhiteRef}
          src={GoldenEraBlanco} 
          alt="Golden Era Logo"
          className="logo-image logo-white"
        />
        <img 
          ref={logoYellowRef}
          src={GoldenEraAmarillo} 
          alt="Golden Era Logo"
          className="logo-image logo-yellow"
        />
      </div>
    </div>
  );
};

export default AnimatedLogo;