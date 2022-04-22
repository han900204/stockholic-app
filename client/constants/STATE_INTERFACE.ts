import { InvestorData } from './GQL_INTERFACE';
import { SymbolData } from './GQL_INTERFACE';

export interface InvestorState {
	isAuthenticated: boolean;
	isPending: boolean;
	investorId: number | null;
	nickName: string | null;
	investors: InvestorData[];
	s3_location: string | null;
}

export interface RoomState {
	newMessage: string;
	newSubscribers: number[];
	currentRoomId: string | '';
}

export interface ThemeState {
	mode: 'light' | 'dark';
}

export interface SearchState {
	stockSearch: string;
}

export interface StockState {
	symbols: SymbolData[];
	currentPortfolios:
		| {
				[key: number]: number[];
		  }
		| {};
}
