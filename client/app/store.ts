import { configureStore } from '@reduxjs/toolkit';
import InvestorReducer from '../features/investorSlice';

export const store = configureStore({
  reducer: { investor: InvestorReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
