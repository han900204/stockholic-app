import React from 'react';
import Btn from './styleComponents/Btn';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../features/investorSlice';
import GQL_QUERY from '../constants/GQL_QUERY';

const Logout = () => {
  const [deleteAuth] = useMutation(GQL_QUERY.DELETE_AUTH_QUERY);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token: string | null = sessionStorage.getItem('token');

  const handleClick = async (e: any) => {
    e.preventDefault();

    await deleteAuth({ variables: { token: token } });
    sessionStorage.clear();
    dispatch(setIsAuthenticated(false));
    navigate('/');
  };
  return <Btn text='Logout' type='button' eHandler={handleClick} />;
};

export default Logout;
