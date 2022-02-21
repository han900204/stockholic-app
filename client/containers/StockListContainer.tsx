import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Subheading from '../components/styleComponents/Subheading';
import StockListSubContainer from './StockListSubContainer';
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
			<StockListSubContainer searchValue={searchValue} />
		</>
	);
};

export default StockListContainer;
