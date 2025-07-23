import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './WhatsAppWidget.scss';

interface WhatsAppWidgetProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ 
  phoneNumber = '5215576966262', // Reemplaza con tu número
  message = 'Hola, me interesa unirme a Golden Era Club!' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  // No mostrar en la página de galería
  const shouldShow = !location.pathname.includes('/gallery');

  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      // Mostrar tooltip después de 3 segundos
      setTimeout(() => setShowTooltip(true), 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  useEffect(() => {
    if (isVisible && shouldShow) {
      gsap.fromTo('.whatsapp-widget',
        {
          scale: 0,
          opacity: 0,
          rotate: -180
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }
      );

      // Animación de pulso continuo
      gsap.to('.whatsapp-widget__icon', {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, [isVisible, shouldShow]);

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Evento para tracking
    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'widget'
      });
    }
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <div className="whatsapp-widget-container">
      <div 
        className="whatsapp-widget"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="whatsapp-widget__icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 28.176 1.116 32.088 3.048 35.472L0 48L12.816 45.024C16.08 46.812 19.896 47.832 24 47.832V48Z" fill="#25D366"/>
            <path d="M35.52 12.48C32.232 9.144 27.816 7.2 23.04 7.2C13.176 7.2 5.256 15.12 5.256 24.984C5.256 28.272 6.192 31.44 7.848 34.2L5.04 42.96L14.064 40.224C16.728 41.736 19.824 42.552 23.04 42.552C32.904 42.552 40.824 34.632 40.824 24.768C40.608 20.208 38.808 15.816 35.52 12.48ZM23.04 39.264C20.256 39.264 17.592 38.568 15.24 37.176L14.664 36.84L8.784 38.28L10.224 32.616L9.864 32.04C8.328 29.568 7.56 26.664 7.56 23.76C7.56 16.176 13.968 10.056 21.768 10.056C25.416 10.056 28.848 11.496 31.512 14.04C34.176 16.584 35.736 20.016 35.736 23.76C36.024 31.56 29.616 39.264 23.04 39.264ZM29.616 27.408C29.184 27.192 27.096 26.16 26.664 25.944C26.232 25.728 25.944 25.728 25.656 26.16C25.368 26.592 24.504 27.624 24.216 27.912C23.928 28.2 23.712 28.2 23.28 27.984C22.848 27.768 21.384 27.336 19.656 25.728C18.264 24.48 17.4 22.896 17.184 22.464C16.968 22.032 17.184 21.816 17.4 21.6C17.616 21.384 17.832 21.096 18.048 20.808C18.264 20.52 18.336 20.376 18.48 20.088C18.624 19.8 18.552 19.512 18.48 19.296C18.408 19.08 17.472 17.064 17.112 16.2C16.752 15.336 16.392 15.48 16.104 15.48C15.816 15.48 15.528 15.48 15.24 15.48C14.952 15.48 14.52 15.552 14.088 15.984C13.656 16.416 12.576 17.448 12.576 19.464C12.576 21.48 14.088 23.424 14.304 23.712C14.52 24 17.4 28.344 23.4 30.288C24.504 30.72 25.368 30.936 26.04 31.152C27.144 31.44 28.104 31.368 28.896 31.296C29.76 31.152 31.392 30.288 31.752 29.352C32.112 28.416 32.112 27.624 32.04 27.48C31.824 27.624 31.464 27.624 29.616 27.408Z" fill="white"/>
          </svg>
        </div>
        
        {showTooltip && (
          <div className="whatsapp-widget__tooltip">
            <span>¡Contáctanos por WhatsApp!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppWidget;