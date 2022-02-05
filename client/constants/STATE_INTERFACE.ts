export interface InvestorState {
  isAuthenticated: boolean;
  isPending: boolean;
  investorId: number | null;
  nickName: string | null;
}

export interface NewMessageState {
  newMessage: string;
}
