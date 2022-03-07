import React, { useState } from 'react';
import { CreatePortfolioItemsPayload } from '../constants/GQL_INTERFACE';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';
import { useCreatePortfolioItems } from '../hooks/useCreatePortfolioItem';
import SingleSelect from './styleComponents/SingleSelect';
import MultiSelect from './styleComponents/MultiSelect';

export default function AddStockToPortfolioModal({ portfolios, symbols }) {
	const [portId, setPortId] = useState<number>(0);
	const [symbolIds, setSymbolIds] = useState<number[]>([]);

	const { createPortfolioItems } = useCreatePortfolioItems();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (portId && symbolIds.length > 0) {
			const createPortfolioItemsPayload: CreatePortfolioItemsPayload = {
				portfolio_id: portId,
				symbol_ids: symbolIds,
			};
			try {
				await createPortfolioItems({
					variables: createPortfolioItemsPayload,
				});
			} catch (e: any) {
				console.log('ERROR: ', e);
			}
		}
	};

	/**
	 *
	 * Convert portfolios data for single-select dropdown
	 */

	const copyPortfolios = JSON.parse(JSON.stringify(portfolios));

	for (let portfolio of copyPortfolios) {
		portfolio['value'] = portfolio['id'];
		portfolio['label'] = portfolio['name'];
		delete portfolio['date_created'];
		delete portfolio['investor_id'];
	}

	/**
	 *
	 * Convert symbols data for multi-select dropdown
	 */

	const copySymbols = JSON.parse(JSON.stringify(symbols));

	for (let symbol of copySymbols) {
		symbol['value'] = symbol['id'];
		symbol['label'] = symbol['name'];
		delete symbol['date_created'];
		delete symbol['is_active'];
	}

	const ModalComponent = (handleClose) => (
		<div>
			<Box
				component='form'
				onSubmit={(e) => {
					handleSubmit(e);
					setPortId(0);
					setSymbolIds([]);
					handleClose();
				}}
				sx={{
					'& .MuiTextField-root': { m: 1, width: '75%' },
				}}
				autoComplete='off'
			>
				<div>
					<SingleSelect
						fieldName='Portfolio'
						state={portId}
						setState={setPortId}
						options={copyPortfolios}
					/>
					<MultiSelect
						items={copySymbols}
						dispatch={(ids) => {
							setSymbolIds(ids);
						}}
						state={symbolIds}
					/>
				</div>
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
