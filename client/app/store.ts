import { configureStore } from '@reduxjs/toolkit';
import InvestorReducer from '../features/investorSlice';
import RoomReducer from '../features/roomSlice';
import ThemeReducer from '../features/themeSlice';
import SearchReducer from '../features/searchSlice';
import StockReducer from '../features/stockSlice';

export const store = configureStore({
	reducer: {
		investor: InvestorReducer,
		room: RoomReducer,
		theme: ThemeReducer,
		search: SearchReducer,
		stock: StockReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
