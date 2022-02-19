import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import { GetSummariesResponse } from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import Subheading from '../components/styleComponents/Subheading';
import StockTable from '../components/StockTable';

const StockListContainer = () => {
	const investorId = useSelector(
		(state: RootState) => state.investor.investorId
	);

	const { loading, error, data } = useQuery<GetSummariesResponse>(
		GQL_QUERY.GET_SUMMARIES_QUERY
	);

	if (loading) return <LoadingForm />;

	return (
		<>
			<Subheading title='Stock List' />
			<StockTable data={data} />
		</>
	);
};

export default StockListContainer;
