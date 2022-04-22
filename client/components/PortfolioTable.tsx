import React, { useState, useEffect } from 'react';
import PortfolioItemTable from './PortfolioItemTable';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDeletePortfolio } from '../hooks/useDeletePortfolio';
import {
	UpdatePortfolioPayload,
	GetPortfolioItemsPayload,
	GetPortfolioItemsResponse,
	PortfolioItemData,
} from '../constants/GQL_INTERFACE';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import { useUpdatePortfolio } from '../hooks/useUpdatePortfolio';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import TextAreaField from './styleComponents/TextAreaField';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { setCurrentPortfolios } from '../features/stockSlice';

const PortfolioTable = ({ data }) => {
	const dispatch = useDispatch();

	function createData(name: string, date_created: string, id: number) {
		return {
			name,
			date_created,
			id,
		};
	}

	const rows = data.map((d) =>
		createData(
			d.name,
			new Date(d.date_created).toISOString().split('T')[0],
			d.id
		)
	);

	function Row({ row }) {
		const [open, setOpen] = useState(false);
		const [isEdit, setIsEdit] = useState(false);
		const [name, setName] = useState('');
		const { updatePortfolio } = useUpdatePortfolio();
		const { deletePortfolio } = useDeletePortfolio();

		// Fetch portfolio items
		const { loading, error, data } = useQuery<
			GetPortfolioItemsResponse,
			GetPortfolioItemsPayload
		>(GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY, {
			variables: { portfolio_id: row.id },
			fetchPolicy: 'cache-and-network',
		});

		// Store portfolio data in redux store
		if (data?.getPortfolioItems) {
			const itemIds = data.getPortfolioItems.reduce(
				(acc: number[], cur: PortfolioItemData) => {
					acc.push(cur.symbol_id);
					return acc;
				},
				[]
			);
			dispatch(setCurrentPortfolios({ [row.id]: itemIds }));
		}

		useEffect(() => {
			setName(row.name);
		}, []);

		// Handle Portfolio Update
		const updatePortfolioPayload: UpdatePortfolioPayload = {
			id: row.id,
			name,
		};

		const handleSubmit = async (e: any) => {
			e.preventDefault();

			try {
				const { data } = await updatePortfolio({
					variables: updatePortfolioPayload,
				});
			} catch (e: any) {
				console.log('ERROR: ', e);
			}
		};

		return (
			<React.Fragment>
				<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
					<TableCell>
						<IconButton
							aria-label='expand row'
							size='small'
							onClick={async () => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
					<TableCell align='left'>
						<Grid
							container
							spacing={2}
							direction='row'
							justifyContent='center'
							alignItems='center'
						>
							{isEdit ? (
								<>
									<Grid item xs={8}>
										<TextAreaField
											eHandler={(e) => {
												setName(e.target.value);
											}}
											type='text'
											label='Portfolio Name'
											required={true}
											rows={1}
											value={name}
										/>
									</Grid>
									<Grid item xs={4}>
										<CheckIcon
											onClick={async (e) => {
												await handleSubmit(e);
												setIsEdit(false);
											}}
										/>
									</Grid>
								</>
							) : (
								<>
									<Grid item xs={8}>
										{row.name}
									</Grid>
									<Grid item xs={4}>
										<ModeEditIcon onClick={() => setIsEdit(true)} />
									</Grid>
								</>
							)}
						</Grid>
					</TableCell>
					<TableCell align='left'>{row.date_created}</TableCell>
					<TableCell align='left'>
						<DeleteForeverIcon
							onClick={async () => {
								await deletePortfolio({
									variables: {
										id: row.id,
									},
								});
							}}
						/>
					</TableCell>
				</TableRow>
				{data?.getPortfolioItems ? (
					<PortfolioItemTable
						cols={[
							'Stock',
							'Quantity',
							'Average Cost',
							'Current Price',
							'Profit',
							'Delete',
						]}
						rows={data?.getPortfolioItems}
						isOpen={open}
					/>
				) : (
					<></>
				)}
			</React.Fragment>
		);
	}

	return (
		<>
			<TableContainer component={Paper}>
				<Table aria-label='collapsible table'>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Portfolio Name</TableCell>
							<TableCell>Date Created</TableCell>
							<TableCell>Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, idx) => (
							<Row key={idx} row={row} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default PortfolioTable;
