import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { InvestorState } from '../constants/STATE_INTERFACE';

const initialState: InvestorState = {
  isAuthenticated: false,
  isPending: false,
  investorId: null,
  nickName: null,
  investors: [],
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
    setInvestorId: (state, action: PayloadAction<number | null>) => {
      state.investorId = action.payload;
    },
    setNickName: (state, action: PayloadAction<string | null>) => {
      state.nickName = action.payload;
    },
    setInvestors: (state, action: PayloadAction<[]>) => {
      state.investors = action.payload;
    },
  },
});

export const {
  setIsAuthenticated,
  setIsPending,
  setInvestorId,
  setNickName,
  setInvestors,
} = investorSlice.actions;

export default investorSlice.reducer;
