import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import { GetSummariesResponse } from '../constants/GQL_INTERFACE';
import LoadingForm from '../components/LoadingForm';
import { RootState } from '../app/store';
import Subheading from '../components/styleComponents/Subheading';
import StockTable from '../components/StockTable';
import SearchBar from '../components/styleComponents/SearchBar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { setStockSearch } from '../features/searchSlice';

const StockListContainer = () => {
	const investorId = useSelector(
		(state: RootState) => state.investor.investorId
	);
	const searchValue = useSelector(
		(state: RootState) => state.search.stockSearch
	);

	// Handler to store a search value in searchSlice
	const dispatch = useDispatch();
	const searchHandler = (e) => {
		e.preventDefault();
		dispatch(setStockSearch(e.target.value));
	};

	// Get stock data from GraphQL
	const { loading, error, data } = useQuery<GetSummariesResponse>(
		GQL_QUERY.GET_SUMMARIES_QUERY
	);

	if (loading) return <LoadingForm />;

	return (
		<>
			<Grid container spacing={2} sx={{ m: 0, p: 0 }}>
				<Grid item xs={8}>
					<Subheading title='Stock List' />
				</Grid>
				<Grid item xs={4}>
					<Box display='flex' justifyContent='flex-end' sx={{ my: 3 }}>
						<SearchBar value={searchValue} eHandler={searchHandler} />
					</Box>
				</Grid>
			</Grid>
			<StockTable data={data?.getSummaries} searchValue={searchValue} />
		</>
	);
};

export default StockListContainer;
