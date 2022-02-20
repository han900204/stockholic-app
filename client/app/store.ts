import { configureStore } from '@reduxjs/toolkit';
import InvestorReducer from '../features/investorSlice';
import RoomReducer from '../features/roomSlice';
import ThemeReducer from '../features/themeSlice';

export const store = configureStore({
	reducer: {
		investor: InvestorReducer,
		room: RoomReducer,
		theme: ThemeReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
