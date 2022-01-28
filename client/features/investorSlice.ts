import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvestorState } from '../constants/STATE_INTERFACE';

const initialState: InvestorState = {
  isAuthenticated: false,
  isPending: false,
};

export const investorSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
  },
});

export const { setIsAuthenticated, setIsPending } = investorSlice.actions;

export default investorSlice.reducer;
