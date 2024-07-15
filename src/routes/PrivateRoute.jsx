import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['protectedContent'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/protected`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('Unauthorized'); // Throw an error for handling in useEffect
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (isError) {
      if (error.message === 'Unauthorized') {
        navigate('/login');
      } else {
        console.error('Error fetching protected content:', error);
      }
    }
  }, [isError, error, navigate]);

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  if (data) {
    return children;
  }

  return <Navigate to='/login' state={{ from: location }} replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PrivateRoute;
