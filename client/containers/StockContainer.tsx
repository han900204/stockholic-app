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

const StockContainer = () => {
	const params = useParams();

	const summary = useQuery<GetSummaryResponse, GetSummaryPayload>(
		GQL_QUERY.GET_SUMMARY_QUERY,
		{ variables: { symbol_id: Number(params.symbolId) } }
	);

	const price = useQuery<GetPricesResponse, GetPricesPayload>(
		GQL_QUERY.GET_PRICES_QUERY,
		{ variables: { symbol_id: Number(params.symbolId) } }
	);

	if (summary.loading || price.loading) return <LoadingForm />;

	console.log(summary.data, price.data);

	return (
		<>
			<h1>Sup!</h1>
		</>
	);
};

export default StockContainer;
