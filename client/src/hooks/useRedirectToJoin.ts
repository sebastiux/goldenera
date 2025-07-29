// client/src/hooks/useRedirectToJoin.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

export const useRedirectToJoin = () => {
  const navigate = useNavigate();

  const redirectToJoin = useCallback((buttonSelector?: string) => {
    if (buttonSelector) {
      // Animación del botón antes de navegar
      gsap.to(buttonSelector, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          navigate('/join');
        }
      });
    } else {
      navigate('/join');
    }
  }, [navigate]);

  const redirectToJoinWithDelay = useCallback((delay: number = 0) => {
    setTimeout(() => {
      navigate('/join');
    }, delay);
  }, [navigate]);

  return { 
    redirectToJoin, 
    redirectToJoinWithDelay 
  };
};