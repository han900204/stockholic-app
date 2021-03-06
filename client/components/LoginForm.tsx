import React from 'react';
import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import Field from './styleComponents/Field';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	ValidateInvestorPayload,
	CreateAuthPayload,
	GetInvestorsResponse,
	GetSymbolsResponse,
} from '../constants/GQL_INTERFACE';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	setIsAuthenticated,
	setInvestorId,
	setNickName,
	setInvestors,
	setS3Location,
} from '../features/investorSlice';
import { setSymbols } from '../features/stockSlice';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailErr, setEmailErr] = useState(false);
	const [pwErr, setPwErr] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const validatePayload: ValidateInvestorPayload = {
		email,
		password,
	};

	const authPayload: CreateAuthPayload = {
		investor_id: null,
	};

	const [createAuth] = useMutation(GQL_QUERY.CREATE_AUTH_QUERY);

	const [validateInvestor] = useMutation(GQL_QUERY.VALIDATE_INVESTOR_QUERY);

	const [getInvestors] = useLazyQuery<GetInvestorsResponse, null>(
		GQL_QUERY.GET_INVESTORS_QUERY
	);

	const [getSymbols] = useLazyQuery<GetSymbolsResponse, null>(
		GQL_QUERY.GET_SYMBOLS_QUERY
	);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const res = await validateInvestor({ variables: validatePayload });
			const investors = await getInvestors();
			const symbols = await getSymbols();

			if (res.data.validateInvestor.id) {
				authPayload.investor_id = res.data.validateInvestor.id;
				const token = await createAuth({ variables: authPayload }).then(
					(res) => res.data.createAuthentication.token
				);
				if (token) {
					sessionStorage.setItem('token', token);
					await dispatch(setIsAuthenticated(true));
					await dispatch(setInvestorId(res.data.validateInvestor.id));
					await dispatch(setNickName(res.data.validateInvestor.nick_name));
					await dispatch(setS3Location(res.data.validateInvestor.s3_location));
					if (investors?.data?.getInvestors) {
						await dispatch(setInvestors(investors.data.getInvestors));
					}
					if (symbols?.data?.getSymbols) {
						await dispatch(setSymbols(symbols.data.getSymbols));
					}
					navigate('/forum');
				}
			}
		} catch (e: any) {
			if (e.message === 'email_wrong') setEmailErr(true);
			if (e.message === 'password_wrong') setPwErr(true);
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
							setEmail(e.target.value);
							setEmailErr(false);
							setPwErr(false);
						}}
						type='email'
						label='Email'
						errState={emailErr}
						errMsg={'Incorrect Email!'}
					/>
				</div>
				<div>
					<Field
						eHandler={(e) => {
							setPassword(e.target.value);
							setEmailErr(false);
							setPwErr(false);
						}}
						type='password'
						label='Password'
						errState={pwErr}
						errMsg={'Incorrect Password!'}
					/>
				</div>
				<br />
				<Btn text='Login' type='submit' />
			</Box>
		</>
	);
};

export default LoginForm;
