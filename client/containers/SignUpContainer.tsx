import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import { Box } from '@material-ui/core';

const SignUpContainer = () => {
	return (
		<>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				sx={{ m: '5rem' }}
			>
				<SignUpForm />
			</Box>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				sx={{ m: '10rem' }}
			>
				Already have account?&nbsp;&nbsp;
				<Link to='/login'>Login</Link>
			</Box>
		</>
	);
};

export default SignUpContainer;
