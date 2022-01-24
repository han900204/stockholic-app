import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/gqlQuery';
import {
  CreateInvestorPayload,
  CreateAuthPayload,
} from '../constants/interfaces';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../features/investorSlice';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createInvestor] = useMutation(GQL_QUERY.CREATE_INVESTOR_QUERY);
  const [createAuth] = useMutation(GQL_QUERY.CREATE_AUTH_QUERY);

  const investorPayload: CreateInvestorPayload = {
    first_name: firstName,
    last_name: lastName,
    nick_name: nickName,
    email,
    password,
  };

  const authPayload: CreateAuthPayload = {
    investor_id: null,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await createInvestor({ variables: investorPayload });

    if (res.data.createInvestor.id) {
      authPayload.investor_id = res.data.createInvestor.id;
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
          <label htmlFor='text'>First Name</label>
          <input
            type='text'
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor='text'>Last Name</label>
          <input
            type='text'
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor='text'>Nick Name</label>
          <input
            type='text'
            onChange={(e) => {
              setNickName(e.target.value);
            }}
          />
        </div>
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
        <button type='submit'>Register</button>
      </form>
    </>
  );
};

export default SignUpForm;
