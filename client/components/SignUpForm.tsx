import React from 'react';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import Field from './styleComponents/Field';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  CreateInvestorPayload,
  CreateAuthPayload,
} from '../constants/GQL_INTERFACE';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setIsAuthenticated,
  setInvestorId,
  setNickName,
} from '../features/investorSlice';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [nicknameErr, setNicknameErr] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createInvestor] = useMutation(GQL_QUERY.CREATE_INVESTOR_QUERY);
  const [createAuth] = useMutation(GQL_QUERY.CREATE_AUTH_QUERY);

  const investorPayload: CreateInvestorPayload = {
    first_name: firstName,
    last_name: lastName,
    nick_name: nickname,
    email,
    password,
  };

  const authPayload: CreateAuthPayload = {
    investor_id: null,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await createInvestor({ variables: investorPayload });

      if (res.data.createInvestor.id) {
        authPayload.investor_id = res.data.createInvestor.id;
        const token = await createAuth({ variables: authPayload }).then(
          (res) => res.data.createAuthentication.token
        );
        if (token) {
          console.log('yo', res.data.createInvestor);
          sessionStorage.setItem('token', token);
          await dispatch(setIsAuthenticated(true));
          await dispatch(setInvestorId(res.data.createInvestor.id));
          await dispatch(setNickName(res.data.createInvestor.nick_name));
          navigate('/forum');
        }
      }
    } catch (e: any) {
      if (e.message === 'email_unique') setEmailErr(true);
      if (e.message === 'nick_name_unique') setNicknameErr(true);
    }
  };

  return (
    <>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        autoComplete='off'
      >
        <div>
          <Field
            eHandler={(e) => {
              setFirstName(e.target.value);
            }}
            type='text'
            label='First Name'
          />
        </div>
        <div>
          <Field
            eHandler={(e) => {
              setLastName(e.target.value);
            }}
            type='text'
            label='Last Name'
          />
        </div>
        <div>
          <Field
            eHandler={(e) => {
              setNickname(e.target.value);
              setNicknameErr(false);
            }}
            type='text'
            label='Nick Name'
            errState={nicknameErr}
            errMsg={'Nick Name Exists!'}
          />
        </div>
        <div>
          <Field
            eHandler={(e) => {
              setEmail(e.target.value);
              setEmailErr(false);
            }}
            type='email'
            label='Email'
            errState={emailErr}
            errMsg={'Email Exists!'}
          />
        </div>
        <div>
          <Field
            eHandler={(e) => {
              setPassword(e.target.value);
            }}
            type='password'
            label='Password'
          />
        </div>
        <br />
        <Btn text='Register' type='submit' />
      </Box>
    </>
  );
};

export default SignUpForm;
