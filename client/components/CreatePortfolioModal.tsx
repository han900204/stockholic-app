import React from 'react';
import { useState } from 'react';
import GQL_QUERY from '../constants/GQL_QUERY';
import { CreatePortfolioPayload } from '../constants/GQL_INTERFACE';
import TextAreaField from './styleComponents/TextAreaField';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';
import { useCreatePortfolio } from '../hooks/useCreatePortfolio';

export default function CreatePortfolioModal({ investorId }) {
	const [name, setName] = useState('');

	const createPortfolioPayload: CreatePortfolioPayload = {
		name,
		investor_id: investorId,
	};

	const { createPortfolio } = useCreatePortfolio();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			const { data } = await createPortfolio({
				variables: createPortfolioPayload,
			});
		} catch (e: any) {
			console.log('ERROR: ', e);
		}
	};

	const ModalComponent = (handleClose) => (
		<div>
			<Box
				component='form'
				onSubmit={(e) => {
					handleSubmit(e);
					setName('');
					handleClose();
				}}
				sx={{
					'& .MuiTextField-root': { m: 1, width: '75%' },
				}}
				autoComplete='off'
			>
				<div>
					<TextAreaField
						eHandler={(e) => {
							setName(e.target.value);
						}}
						type='text'
						label='Portfolio Name'
						required={true}
						rows={1}
					/>
				</div>
				<br />
				<Btn text='Create' type='submit' />
			</Box>
		</div>
	);

	return (
		<BasicModal
			buttonName={'Create Portfolio'}
			heading={'Create a New Portfolio'}
			Component={ModalComponent}
		/>
	);
}
