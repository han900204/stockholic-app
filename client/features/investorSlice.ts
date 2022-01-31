import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { InvestorState } from '../constants/STATE_INTERFACE';

const initialState: InvestorState = {
  isAuthenticated: false,
  isPending: false,
  investorId: null,
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
    setInvestorId: (state, action: PayloadAction<number>) => {
      state.investorId = action.payload;
    },
  },
});

export const { setIsAuthenticated, setIsPending, setInvestorId } =
  investorSlice.actions;

export default investorSlice.reducer;
