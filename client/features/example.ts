import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Async Thunk
 */
export const increment = createAsyncThunk(
  "counter/increment",
  async (num: number) => {
    const asyncFunc = async (n: number) => {
      return n * 2;
    };
    const res = await asyncFunc(num);
    return res;
  }
);

export interface CounterState {
  value: number;
  status: string | null;
}

const initialState: CounterState = {
  value: 0,
  status: null,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(increment.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(increment.fulfilled, (state, { payload }) => {
      state.value += payload;
      state.status = "success";
    });
    builder.addCase(increment.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export const { decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
