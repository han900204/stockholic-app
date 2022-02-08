import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RoomState } from '../constants/STATE_INTERFACE';

const initialState: RoomState = {
  newMessage: '',
  newSubscribers: [],
  currentRoom: '',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage = action.payload;
    },
    setNewSubscribers: (state, action: PayloadAction<number>) => {
      state.newSubscribers = [...state.newSubscribers, action.payload];
    },
    setCurrentRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload;
    },
    clearNewSubscribers: (state) => {
      state.newSubscribers = [];
    },
  },
});

export const { setNewMessage, setNewSubscribers, setCurrentRoom } =
  roomSlice.actions;

export default roomSlice.reducer;
