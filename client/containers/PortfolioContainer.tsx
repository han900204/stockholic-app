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
import Subheading from '../components/styleComponents/Subheading';
import CreatePortfolioModal from '../components/CreatePortfolioModal';
import { SymbolData } from '../constants/GQL_INTERFACE';

const PortfolioContainer = () => {
	const investorId: number | null = useSelector(
		(state: RootState) => state.investor.investorId
	);
	const symbols: SymbolData[] = useSelector(
		(state: RootState) => state.stock.symbols
	);

	const { loading, error, data } = useQuery<
		GetPortfoliosResponse,
		GetPortfoliosPayload
	>(GQL_QUERY.GET_PORTFOLIOS_QUERY, { variables: { investor_id: investorId } });

	if (loading) return <LoadingForm />;

	return (
		<>
			<Subheading title='Investor Portfolio' />
			<CreatePortfolioModal investorId={investorId} />
			<PortfolioTable data={data?.getPortfolios} symbols={symbols} />
		</>
	);
};

export default PortfolioContainer;
