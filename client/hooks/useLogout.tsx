import React from 'react';
import Btn from '../components/styleComponents/Btn';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../features/investorSlice';
import GQL_QUERY from '../constants/GQL_QUERY';

const useLogout = () => {
  const [deleteAuth] = useMutation(GQL_QUERY.DELETE_AUTH_QUERY);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token: string | null = sessionStorage.getItem('token');

  const logout = async () => {
    await deleteAuth({ variables: { token: token } });
    sessionStorage.clear();
    dispatch(setIsAuthenticated(false));
    navigate('/login');
  };
  return {
    logout,
  };
};

export default useLogout;
