import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StockState } from '../constants/STATE_INTERFACE';
import { SymbolData } from '../constants/GQL_INTERFACE';

const initialState: StockState = {
	symbols: [],
	currentPortfolios: {},
};

export const stockSlice = createSlice({
	name: 'stock',
	initialState,
	reducers: {
		setSymbols: (state, action: PayloadAction<SymbolData[]>) => {
			state.symbols = action.payload;
		},
		setCurrentPortfolios: (
			state,
			action: PayloadAction<{ [key: number]: number[] }>
		) => {
			state.currentPortfolios = {
				...state.currentPortfolios,
				...action.payload,
			};
		},
		addNewItemsToPortfolio: (
			state,
			action: PayloadAction<{ [key: number]: number[] }>
		) => {
			const portfolioId = Object.keys(action.payload)[0];
			const itemIds = [
				...state.currentPortfolios[portfolioId],
				...action.payload[portfolioId],
			];
			state.currentPortfolios = {
				...state.currentPortfolios,
				...{ [portfolioId]: itemIds },
			};
		},
		removeItemsFromPortfolio: (
			state,
			action: PayloadAction<{ [key: number]: number }>
		) => {
			const portfolioId = Object.keys(action.payload)[0];
			const itemIds = state.currentPortfolios[portfolioId].filter(
				(id) => id !== action.payload[portfolioId]
			);
			state.currentPortfolios = {
				...state.currentPortfolios,
				...{ [portfolioId]: itemIds },
			};
		},
	},
});

export const {
	setSymbols,
	setCurrentPortfolios,
	addNewItemsToPortfolio,
	removeItemsFromPortfolio,
} = stockSlice.actions;

export default stockSlice.reducer;
