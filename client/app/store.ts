import { configureStore } from '@reduxjs/toolkit';
import InvestorReducer from '../features/investorSlice';
import RoomReducer from '../features/roomSlice';

export const store = configureStore({
  reducer: { investor: InvestorReducer, room: RoomReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
