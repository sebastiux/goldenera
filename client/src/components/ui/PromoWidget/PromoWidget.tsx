import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import './PromoWidget.scss';

interface PromoWidgetProps {
  isActive: boolean;
  onClose: () => void;
}

const PromoWidget: React.FC<PromoWidgetProps> = ({ isActive, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 horas en segundos
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const widgetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const minimizedRef = useRef<HTMLDivElement>(null);

  // No mostrar en gallery
  const shouldShow = !location.pathname.includes('/gallery') && isActive;

  useEffect(() => {
    if (shouldShow && !isVisible) {
      setIsVisible(true);
      setTimeout(() => animateIn(), 2000);
    } else if (!shouldShow && isVisible) {
      animateOut();
    }
  }, [shouldShow]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onClose]);

  // Efecto de pulso cada 45 segundos
  useEffect(() => {
    if (!isVisible) return;

    const pulseInterval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 45000);

    return () => clearInterval(pulseInterval);
  }, [isVisible]);

  const animateIn = () => {
    if (!widgetRef.current) return;

    gsap.set(widgetRef.current, {
      x: 300,
      opacity: 0,
      scale: 0.8
    });

    const tl = gsap.timeline();
    
    tl
      .to(widgetRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.4)"
      })
      .to(widgetRef.current, {
        scale: 1.02,
        duration: 0.15,
        ease: "power2.out"
      })
      .to(widgetRef.current, {
        scale: 1,
        duration: 0.15,
        ease: "power2.out"
      });
  };

  const animateOut = () => {
    if (!widgetRef.current) return;

    gsap.to(widgetRef.current, {
      x: 300,
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => setIsVisible(false)
    });
  };

  const handleMinimize = () => {
    if (!contentRef.current || !minimizedRef.current) return;

    if (!isMinimized) {
      gsap.to(contentRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in"
      });
      
      gsap.to(minimizedRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "back.out(1.5)",
        delay: 0.15
      });
    } else {
      gsap.to(minimizedRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in"
      });
      
      gsap.to(contentRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "back.out(1.5)",
        delay: 0.15
      });
    }
    
    setIsMinimized(!isMinimized);
  };

  const handleJoinNow = () => {
    animateOut();
    setTimeout(() => {
      navigate('/join');
    }, 400);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`promo-widget ${showPulse ? 'promo-widget--pulse' : ''}`} 
      ref={widgetRef}
    >
      {/* Contenido principal */}
      <div 
        className="promo-widget__content" 
        ref={contentRef}
        style={{ display: isMinimized ? 'none' : 'block' }}
      >
        <div className="promo-widget__header">
          <button className="promo-widget__minimize" onClick={handleMinimize}>
            <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
              <rect width="12" height="2" fill="currentColor"/>
            </svg>
          </button>
          <button className="promo-widget__close" onClick={animateOut}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="promo-widget__main">
          <div className="promo-widget__offer">
            <span className="offer-discount">50% OFF</span>
            <span className="offer-text">Oferta Exclusiva</span>
          </div>

          <div className="promo-widget__timer">
            <span className="timer-value">{formatTime(timeLeft)}</span>
          </div>


          <button className="promo-widget__cta" onClick={handleJoinNow}>
            <span>Únete Ahora</span>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M10 1L15 6L10 11M15 6H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="promo-widget__urgency">
            <div className="urgency-indicator"></div>
            <span>Solo 7 lugares disponibles</span>
          </div>
        </div>
      </div>

      {/* Vista minimizada */}
      <div 
        className="promo-widget__minimized"
        ref={minimizedRef}
        onClick={handleMinimize}
        style={{ display: isMinimized ? 'flex' : 'none' }}
      >
        <div className="minimized-content">
          <span className="minimized-discount">50% OFF</span>
          <span className="minimized-timer">{formatTime(timeLeft)}</span>
        </div>
        <div className="minimized-indicator"></div>
      </div>
    </div>
  );
};

export default PromoWidget;