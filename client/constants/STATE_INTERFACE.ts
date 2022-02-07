export interface InvestorState {
  isAuthenticated: boolean;
  isPending: boolean;
  investorId: number | null;
  nickName: string | null;
  investors: number[];
}

export interface NewMessageState {
  newMessage: string;
}
