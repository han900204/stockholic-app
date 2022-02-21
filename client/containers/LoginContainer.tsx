import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { Box } from '@material-ui/core';

const LoginContainer = () => {
	return (
		<>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				sx={{ m: '5rem' }}
			>
				<LoginForm />
			</Box>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				sx={{ m: '10rem' }}
			>
				Do not have account?&nbsp;&nbsp;
				<Link to='/signup'>Sign Up</Link>
			</Box>
		</>
	);
};

export default LoginContainer;
