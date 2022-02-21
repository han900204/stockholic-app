import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetSummariesResponse,
	GetSummariesPayload,
} from '../constants/GQL_INTERFACE';
import LoadingForm from '../components/LoadingForm';
import StockTable from '../components/StockTable';

const StockListSubContainer = ({ searchValue }) => {
	// Get stock data from GraphQL
	const { loading, error, data } = useQuery<
		GetSummariesResponse,
		GetSummariesPayload
	>(GQL_QUERY.GET_SUMMARIES_QUERY, {
		variables: {
			searchVal: searchValue,
		},
	});

	if (loading) return <LoadingForm />;

	console.log('filtered data', data);

	return (
		<>
			<StockTable data={data} />
		</>
	);
};

export default StockListSubContainer;
