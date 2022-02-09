import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RoomState } from '../constants/STATE_INTERFACE';

const initialState: RoomState = {
  newMessage: '',
  newSubscribers: [],
  currentRoom: '',
  currentRoomOwnerId: null,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage = action.payload;
    },
    setNewSubscribers: (state, action: PayloadAction<number[]>) => {
      state.newSubscribers = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload;
    },
    setCurrentRoomOwnerId: (state, action: PayloadAction<number | null>) => {
      state.currentRoomOwnerId = action.payload;
    },
  },
});

export const {
  setNewMessage,
  setNewSubscribers,
  setCurrentRoom,
  setCurrentRoomOwnerId,
} = roomSlice.actions;

export default roomSlice.reducer;
