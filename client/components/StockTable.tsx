import React from 'react';
import SimpleTable from '../components/styleComponents/SimpleTable';
import { SummaryColumn, SummaryData } from '../constants/STYLE_INTERFACE';

const StockTable = ({ data }) => {
	const columns: readonly SummaryColumn[] = [
		{ id: 'id', label: 'id', minWidth: 20 },
		{ id: 'symbol', label: 'Symbol', minWidth: 20 },
		{
			id: 'short_name',
			label: 'Company Name',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'sector',
			label: 'Sector',
		},
		{
			id: 'current_price',
			label: 'Price',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'recommendation_key',
			label: 'Recommendation',
		},
		{
			id: 'target_mean_price',
			label: 'Target Price',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'earnings_growth',
			label: 'Earning Growth',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'current_ratio',
			label: 'Current Ratio',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'debt_to_equity',
			label: 'D/E',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'return_on_equity',
			label: 'ROE',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'price_to_book',
			label: 'P/B',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'forward_pe',
			label: 'Forward P/E',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'dividend_yield',
			label: 'Div. Yield',
			align: 'right',
			format: (value: number) => value.toLocaleString('en-US'),
		},
	];

	function createData(
		id: number,
		symbol: string,
		short_name: string | null,
		sector: string | null,
		current_price: number | null,
		recommendation_key: string | null,
		target_mean_price: number | null,
		earnings_growth: number | null,
		current_ratio: number | null,
		debt_to_equity: number | null,
		return_on_equity: number | null,
		price_to_book: number | null,
		forward_pe: number | null,
		dividend_yield: number | null
	): SummaryData {
		return {
			id,
			symbol,
			short_name,
			sector,
			current_price,
			recommendation_key,
			target_mean_price,
			earnings_growth,
			current_ratio,
			debt_to_equity,
			return_on_equity,
			price_to_book,
			forward_pe,
			dividend_yield,
		};
	}

	const rows = data.getSummaries.reduce((row, stock) => {
		row.push(
			createData(
				stock.id,
				stock.symbol,
				stock.short_name,
				stock.sector,
				stock.current_price,
				stock.recommendation_key,
				stock.target_mean_price,
				stock.earnings_growth,
				stock.current_ratio,
				stock.debt_to_equity,
				stock.return_on_equity,
				stock.price_to_book,
				stock.forward_pe,
				stock.dividend_yield
			)
		);
		return row;
	}, []);

	return (
		<SimpleTable
			columns={columns}
			rows={rows}
			linkCol='symbol'
			linkUrl='/stocks'
		/>
	);
};

export default StockTable;
