import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';

const SignUpContainer = () => {
  return (
    <>
      <div>
        <SignUpForm />
      </div>
      <div>
        <Link to='/login'>Login</Link>
      </div>
    </>
  );
};

export default SignUpContainer;
