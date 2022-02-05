import React from 'react';
import Btn from '../components/styleComponents/Btn';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setIsAuthenticated,
  setInvestorId,
  setNickName,
} from '../features/investorSlice';
import GQL_QUERY from '../constants/GQL_QUERY';

const useLogout = () => {
  const [deleteAuth] = useMutation(GQL_QUERY.DELETE_AUTH_QUERY);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token: string | null = sessionStorage.getItem('token');

  const logout = async () => {
    await deleteAuth({ variables: { token: token } });
    sessionStorage.clear();
    await dispatch(setIsAuthenticated(false));
    await dispatch(setInvestorId(null));
    await dispatch(setNickName(null));
    navigate('/login');
  };
  return {
    logout,
  };
};

export default useLogout;
