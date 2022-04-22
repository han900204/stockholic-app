import React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'left',
	color: theme.palette.text.secondary,
}));

const SummaryForm = ({ summaryData }) => {
	const keys = [
		'short_name',
		'symbol',
		'current_price',
		'target_mean_price',
		'recommendation_key',
		'sector',
		'current_ratio',
		'debt_to_equity',
		'earnings_growth',
		'return_on_equity',
		'price_to_book',
		'forward_pe',
		'dividend_yield',
		'long_business_summary',
	];

	const nameMap = {
		short_name: 'Company Name',
		symbol: 'Symbol',
		current_price: 'Current Price',
		target_mean_price: 'Target Price',
		recommendation_key: 'Recommendation',
		sector: 'Sector',
		current_ratio: 'Current Ratio',
		debt_to_equity: 'Debt to Equity',
		earnings_growth: 'Earnings Growth',
		return_on_equity: 'Return on Equity',
		price_to_book: 'Price to Book',
		forward_pe: 'Forward PE',
		dividend_yield: 'Dividend Yield',
		long_business_summary: 'Business Summary',
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
				{keys.map((key, idx) =>
					key === 'long_business_summary' ? (
						<Grid item xs={12} key={idx}>
							<Item>
								<Typography sx={{ fontWeight: 'bold' }}>
									{nameMap[key]}:&nbsp;
								</Typography>{' '}
								{summaryData[key]}
							</Item>
						</Grid>
					) : key === 'recommendation_key' ? (
						<Grid item xs={6} key={idx}>
							<Item>
								<Typography sx={{ fontWeight: 'bold' }} display='inline'>
									{nameMap[key]}:&nbsp;
								</Typography>{' '}
								{summaryData[key].toUpperCase()}
							</Item>
						</Grid>
					) : (
						<Grid item xs={6} key={idx}>
							<Item>
								<Typography sx={{ fontWeight: 'bold' }} display='inline'>
									{nameMap[key]}:&nbsp;
								</Typography>{' '}
								{summaryData[key]}
							</Item>
						</Grid>
					)
				)}
			</Grid>
		</Box>
	);
};

export default SummaryForm;
