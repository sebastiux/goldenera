import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '../Logo/AnimatedLogo';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Reducir el tiempo total a 4 segundos
    const timer = setTimeout(() => {
      sessionStorage.setItem('hasSeenLanding', 'true');
      
      // Fade out rápido y navegar
      gsap.to('.landing-page', {
        opacity: 0,
        duration: 0.5,
        ease: "power4.inOut",
        onComplete: () => {
          navigate('/home');
        }
      });
    }, 4000); // 4 segundos total

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="landing-page">
      <AnimatedLogo />
    </div>
  );
};

export default LandingPage;