import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ThemeState } from '../constants/STATE_INTERFACE';

const initialState: ThemeState = {
	mode: 'light',
};

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setMode: (state, action: PayloadAction<'light' | 'dark'>) => {
			console.log(`Setting theme to ${action.payload}`);
			state.mode = action.payload;
		},
	},
});

export const { setMode } = themeSlice.actions;

export default themeSlice.reducer;
