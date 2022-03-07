import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StockState } from '../constants/STATE_INTERFACE';
import { SymbolData } from '../constants/GQL_INTERFACE';

const initialState: StockState = {
	symbols: [],
};

export const stockSlice = createSlice({
	name: 'stock',
	initialState,
	reducers: {
		setSymbols: (state, action: PayloadAction<SymbolData[]>) => {
			state.symbols = action.payload;
		},
	},
});

export const { setSymbols } = stockSlice.actions;

export default stockSlice.reducer;
