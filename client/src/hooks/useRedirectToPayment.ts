import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRedirectToPayment = () => {
  const navigate = useNavigate();

  const redirectToPayment = useCallback(() => {
    navigate('/join');
  }, [navigate]);

  return { redirectToPayment };
};