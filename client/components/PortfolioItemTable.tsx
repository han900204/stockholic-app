import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import currencyFormatter from '../utils/currencyFormatter';
import Grid from '@mui/material/Grid';
import AdjQtyToStockModal from './AdjQtyToStockModal';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DeletePortfolioItemPayload } from '../constants/GQL_INTERFACE';
import { useDeletePortfolioItem } from '../hooks/useDeletePortfolioItem';

function Row({ row }) {
	const deletePortfolioItemPayload: DeletePortfolioItemPayload = {
		id: row.id,
	};
	const { deletePortfolioItem } = useDeletePortfolioItem();

	return (
		<React.Fragment>
			<TableRow>
				<TableCell component='th' scope='row' align='left'>
					{row.short_name}
				</TableCell>
				<TableCell align='left'>
					<Grid
						container
						spacing={2}
						direction='row'
						justifyContent='center'
						alignItems='center'
					>
						<>
							<Grid item xs={3}>
								{row.quantity}
							</Grid>
							<Grid item xs={9}>
								<>
									<AdjQtyToStockModal
										qty={row.quantity}
										avgCost={row.average_cost}
										id={row.id}
									/>
								</>
							</Grid>
						</>
					</Grid>
				</TableCell>
				<TableCell align='left'>
					{currencyFormatter.format(row.average_cost)}
				</TableCell>
				<TableCell align='left'>
					{currencyFormatter.format(row.current_price)}
				</TableCell>
				<TableCell align='left'>
					{currencyFormatter.format(
						row.quantity * row.current_price - row.quantity * row.average_cost
					)}
				</TableCell>
				<TableCell align='left'>
					<DeleteForeverIcon
						onClick={async () => {
							await deletePortfolioItem({
								variables: deletePortfolioItemPayload,
							});
						}}
					/>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function PortfolioItemTable({ cols, rows, isOpen }) {
	return (
		<React.Fragment>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={isOpen} timeout='auto' unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size='small' aria-label='purchases'>
								<TableHead>
									<TableRow>
										{cols.map((col, idx) => (
											<TableCell key={idx} align='left' width={300}>
												{col}
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row, idx) => (
										<Row key={idx} row={row} />
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}
