import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page which now has both login and signup
    navigate('/login', { replace: true, state: { showRegister: true } });
  }, [navigate]);

  return null; // This component just redirects, so return null
};

export default Register;
