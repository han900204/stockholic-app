import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RoomState } from '../constants/STATE_INTERFACE';

const initialState: RoomState = {
	newMessage: '',
	newSubscribers: [],
	currentRoomId: '',
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
		setCurrentRoomId: (state, action: PayloadAction<string>) => {
			state.currentRoomId = action.payload;
		},
	},
});

export const { setNewMessage, setNewSubscribers, setCurrentRoomId } =
	roomSlice.actions;

export default roomSlice.reducer;
