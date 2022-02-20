import { InvestorData } from './GQL_INTERFACE';

export interface InvestorState {
	isAuthenticated: boolean;
	isPending: boolean;
	investorId: number | null;
	nickName: string | null;
	investors: InvestorData[];
}

export interface RoomState {
	newMessage: string;
	newSubscribers: number[];
	currentRoom: string | '';
	currentRoomOwnerId: number | null;
}

export interface ThemeState {
	mode: 'light' | 'dark';
}
