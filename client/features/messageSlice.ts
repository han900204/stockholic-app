import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NewMessageState } from '../constants/STATE_INTERFACE';

const initialState: NewMessageState = {
  newMessage: '',
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage = action.payload;
    },
  },
});

export const { setNewMessage } = messageSlice.actions;

export default messageSlice.reducer;
