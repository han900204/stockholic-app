import { configureStore } from '@reduxjs/toolkit';
import InvestorReducer from '../features/investorSlice';
import MessageReducer from '../features/messageSlice';

export const store = configureStore({
  reducer: { investor: InvestorReducer, message: MessageReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
