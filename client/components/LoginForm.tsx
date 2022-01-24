import React from 'react';
import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import GQL_QUERY from '../constants/gqlQuery';
import {
  ValidateInvestorPayload,
  CreateAuthPayload,
} from '../constants/interfaces';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../features/investorSlice';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [validateInvestor] = useLazyQuery(GQL_QUERY.VALIDATE_INVESTOR_QUERY);
  const [createAuth] = useMutation(GQL_QUERY.CREATE_AUTH_QUERY);

  const validatePayload: ValidateInvestorPayload = {
    email,
    password,
  };

  const authPayload: CreateAuthPayload = {
    investor_id: null,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await validateInvestor({ variables: validatePayload });
    if (res.data.validateInvestor.id) {
      authPayload.investor_id = res.data.validateInvestor.id;
      const token = await createAuth({ variables: authPayload }).then(
        (res) => res.data.createAuthentication.token
      );
      if (token) {
        sessionStorage.setItem('token', token);
        dispatch(setIsAuthenticated(true));
        navigate('/');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <br />
        <button type='submit'>Login</button>
      </form>
    </>
  );
};

export default LoginForm;
