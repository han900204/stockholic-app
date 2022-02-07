import { InvestorData } from './GQL_INTERFACE';

export interface InvestorState {
  isAuthenticated: boolean;
  isPending: boolean;
  investorId: number | null;
  nickName: string | null;
  investors: InvestorData[];
}

export interface NewMessageState {
  newMessage: string;
}
