import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function BillingCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to pricing page after cancel
    navigate('/pricing', { replace: true });
  }, [navigate]);

  return null;
}
