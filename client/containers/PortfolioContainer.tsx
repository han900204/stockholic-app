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
import AddStockToPortfolioModal from '../components/AddStockToPortfolioModal';
import Stack from '@mui/material/Stack';

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
			<Stack
				direction='row'
				spacing={2}
				justifyContent='left'
				alignItems='left'
			>
				<CreatePortfolioModal investorId={investorId} />
				<AddStockToPortfolioModal
					portfolios={data?.getPortfolios}
					symbols={symbols}
				/>
			</Stack>

			<PortfolioTable data={data?.getPortfolios} />
		</>
	);
};

export default PortfolioContainer;
