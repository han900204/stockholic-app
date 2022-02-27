import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import currencyFormatter from '../utils/currencyFormatter';

function Row({ cols, row, isOpen }) {
	console.log('row', row);
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
									<TableRow>
										<TableCell component='th' scope='row' align='left'>
											{row.short_name}
										</TableCell>
										<TableCell align='left'>{row.quantity}</TableCell>
										<TableCell align='left'>{row.average_cost}</TableCell>
										<TableCell align='left'>{row.current_price}</TableCell>
										<TableCell align='left'>
											{currencyFormatter.format(
												row.quantity * row.average_cost -
													row.quantity * row.current_price
											)}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function PortfolioItemTable({ cols, rows, isOpen }) {
	return (
		<>
			{rows.map((row, idx) => (
				<Row key={idx} cols={cols} row={row} isOpen={isOpen} />
			))}
		</>
	);
}
