import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginContainer = () => {
  return (
    <>
      <div>
        <LoginForm />
      </div>
      <div>
        <Link to='/signup'>Sign Up</Link>
      </div>
    </>
  );
};

export default LoginContainer;
