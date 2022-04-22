import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { SearchState } from '../constants/STATE_INTERFACE';

const initialState: SearchState = {
	stockSearch: '',
};

export const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		setStockSearch: (state, action: PayloadAction<string>) => {
			state.stockSearch = action.payload;
		},
	},
});

export const { setStockSearch } = searchSlice.actions;

export default searchSlice.reducer;
