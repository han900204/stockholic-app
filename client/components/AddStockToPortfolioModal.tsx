import React, { useState } from 'react';
import { CreatePortfolioItemPayload } from '../constants/GQL_INTERFACE';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';
import { useCreatePortfolioItem } from '../hooks/useCreatePortfolioItem';
import TextAreaField from './styleComponents/TextAreaField';

export default function AddStockToPortfolioModal({ portfolios, symbols }) {
	const [portId, setPortId] = useState<number | null>();
	const [symbolId, setSymbolId] = useState<number | null>();

	const { createPortfolioItem } = useCreatePortfolioItem();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (portId && symbolId) {
			const createPortfolioItemPayload: CreatePortfolioItemPayload = {
				portfolio_id: portId,
				symbol_id: symbolId,
			};
			try {
				await createPortfolioItem({
					variables: createPortfolioItemPayload,
				});
			} catch (e: any) {
				console.log('ERROR: ', e);
			}
		}
	};

	const ModalComponent = (handleClose) => (
		<div>
			<Box
				component='form'
				onSubmit={(e) => {
					handleSubmit(e);
					setPortId(null);
					setSymbolId(null);
					handleClose();
				}}
				sx={{
					'& .MuiTextField-root': { m: 1, width: '75%' },
				}}
				autoComplete='off'
			>
				<div></div>
				<br />
				<Btn text='Add' type='submit' />
			</Box>
		</div>
	);

	return (
		<BasicModal
			buttonName={'Add Stock'}
			heading={'Add Stock to Portfolio'}
			Component={ModalComponent}
		/>
	);
}
