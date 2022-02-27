import React, { useState } from 'react';
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
import { useGetPortfolioItems } from '../hooks/useGetPortfolioItems';
import { PortfolioItemData } from '../constants/GQL_INTERFACE';
import LoadingForm from './LoadingForm';

const PortfolioTable = ({ data }) => {
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
		const [open, setOpen] = React.useState(false);
		const [items, setItems] = React.useState<PortfolioItemData[] | undefined>();

		const { getPortfolioItems } = useGetPortfolioItems();

		return (
			<React.Fragment>
				<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
					<TableCell>
						<IconButton
							aria-label='expand row'
							size='small'
							onClick={async () => {
								setOpen(!open);
								if (!open) {
									const res = await getPortfolioItems({
										variables: { portfolio_id: row.id },
									});
									setItems(res.data?.getPortfolioItems);
								}
							}}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>

					{Object.keys(row).reduce<JSX.Element[]>((jsxArr, key, idx) => {
						if (key !== 'id') {
							jsxArr.push(
								<TableCell key={idx} align='left'>
									{row[key]}
								</TableCell>
							);
						}
						return jsxArr;
					}, [])}
				</TableRow>
				{items ? (
					<PortfolioItemTable
						cols={[
							'Stock',
							'Quantity',
							'Average Cost',
							'Current Price',
							'Profit',
						]}
						rows={items}
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
