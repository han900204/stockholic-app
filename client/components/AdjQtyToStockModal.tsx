import React, { useState } from 'react';
import { UpdatePortfolioItemPayload } from '../constants/GQL_INTERFACE';
import { useUpdatePortfolioItem } from '../hooks/useUpdatePortfolioItem';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import Field from './styleComponents/Field';
import IconModal from './styleComponents/IconModal';
import HeightIcon from '@mui/icons-material/Height';

export default function AdjQtyToStockModal({
	qty,
	avgCost,
	id,
}: {
	qty: number;
	avgCost: number;
	id: number;
}) {
	const [adjQty, setAdjQty] = useState<number>(0);
	const [cost, setCost] = useState<number>(0);
	const { updatePortfolioItem } = useUpdatePortfolioItem();

	const handleSubmit = async (
		id: number,
		newQty: number,
		newAvgCost: number
	) => {
		const updatePortfolioItemPayload: UpdatePortfolioItemPayload = {
			id,
			quantity: newQty,
			average_cost: newAvgCost,
		};
		try {
			await updatePortfolioItem({
				variables: updatePortfolioItemPayload,
			});
		} catch (e: any) {
			console.log('ERROR: ', e);
		}
	};

	const ModalComponent = (handleClose: () => void) => (
		<div>
			<Box
				component='form'
				onSubmit={async (e) => {
					e.preventDefault();
					const newQty = qty + adjQty < 0 ? 0 : qty + adjQty;
					const newAvgCost =
						newQty === 0 ? 0 : (qty * avgCost + adjQty * cost) / newQty;

					await handleSubmit(id, newQty, newAvgCost);
					handleClose();
				}}
				sx={{
					'& .MuiTextField-root': { m: 1, width: '75%' },
				}}
				autoComplete='off'
			>
				<div>
					<Field
						eHandler={(e) => {
							setAdjQty(Number(e.target.value));
						}}
						type='number'
						label='Quantity'
					/>
					<Field
						eHandler={(e) => {
							setCost(Number(e.target.value));
						}}
						type='number'
						label='Cost'
					/>
				</div>
				<br />
				<Btn text='Adjust' type='submit' />
			</Box>
		</div>
	);

	return (
		<IconModal
			Icon={HeightIcon}
			color='success'
			heading='Adjust Quantity'
			Component={ModalComponent}
		/>
	);
}
