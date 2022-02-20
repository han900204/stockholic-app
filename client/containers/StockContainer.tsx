import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetSummaryPayload,
	GetSummaryResponse,
	GetPricesPayload,
	GetPricesResponse,
} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import { useParams } from 'react-router-dom';
import StockForm from '../components/StockForm';

const StockContainer = () => {
	const params = useParams();

	const investorId = useSelector(
		(state: RootState) => state.investor.investorId
	);

	const summary = useQuery<GetSummaryResponse, GetSummaryPayload>(
		GQL_QUERY.GET_SUMMARY_QUERY,
		{ variables: { symbol_id: Number(params.symbolId) } }
	);

	const price = useQuery<GetPricesResponse, GetPricesPayload>(
		GQL_QUERY.GET_PRICES_QUERY,
		{ variables: { symbol_id: Number(params.symbolId) } }
	);

	if (summary.loading || price.loading) return <LoadingForm />;

	return (
		<>
			<StockForm
				summaryData={summary.data?.getSummary}
				priceData={price.data?.getPrices}
			/>
		</>
	);
};

export default StockContainer;
