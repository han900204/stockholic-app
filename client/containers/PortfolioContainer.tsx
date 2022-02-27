import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetPortfoliosPayload,
	GetPortfoliosResponse,
} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import PortfolioTable from '../components/PortfolioTable';

const PortfolioContainer = () => {
	const investorId: number | null = useSelector(
		(state: RootState) => state.investor.investorId
	);

	const { loading, error, data } = useQuery<
		GetPortfoliosResponse,
		GetPortfoliosPayload
	>(GQL_QUERY.GET_PORTFOLIOS_QUERY, { variables: { investor_id: investorId } });

	if (loading) return <LoadingForm />;

	return (
		<>
			<h1>Hello Portfolio</h1>
			<PortfolioTable data={data?.getPortfolios} />
		</>
	);
};

export default PortfolioContainer;
