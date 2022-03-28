import { DocumentNode } from 'graphql';

/**
 * GraphQL Query Interface
 */
export interface QueryInterface {
	CREATE_INVESTOR_QUERY: DocumentNode;
	CREATE_AUTH_QUERY: DocumentNode;
	GET_AUTHENTICATION_QUERY: DocumentNode;
	VALIDATE_INVESTOR_QUERY: DocumentNode;
	GET_INVESTOR_QUERY: DocumentNode;
	GET_INVESTORS_QUERY: DocumentNode;
	DELETE_AUTH_QUERY: DocumentNode;
	GET_FORUMS_QUERY: DocumentNode;
	CREATE_FORUM_QUERY: DocumentNode;
	DELETE_FORUM_QUERY: DocumentNode;
	UPDATE_FORUM_QUERY: DocumentNode;
	GET_FORUM_QUERY: DocumentNode;
	GET_COMMENTS_QUERY: DocumentNode;
	CREATE_COMMENT_QUERY: DocumentNode;
	UPDATE_COMMENT_QUERY: DocumentNode;
	DELETE_COMMENT_QUERY: DocumentNode;
	GET_ROOMS_QUERY: DocumentNode;
	CREATE_ROOM_QUERY: DocumentNode;
	DELETE_ROOM_QUERY: DocumentNode;
	SUBSCRIBE_ROOM_QUERY: DocumentNode;
	UNSUBSCRIBE_ROOM_QUERY: DocumentNode;
	NOTIFY_DELETED_ROOM_QUERY: DocumentNode;
	GET_MESSAGES_QUERY: DocumentNode;
	CREATE_MESSAGE_QUERY: DocumentNode;
	DELETE_MESSAGE_QUERY: DocumentNode;
	ADD_SUBSCRIBERS_QUERY: DocumentNode;
	REMOVE_SUBSCRIBER_QUERY: DocumentNode;
	SUBSCRIBE_MESSAGE: DocumentNode;
	GET_SYMBOLS_QUERY: DocumentNode;
	GET_SUMMARY_QUERY: DocumentNode;
	GET_SUMMARIES_QUERY: DocumentNode;
	GET_PRICES_QUERY: DocumentNode;
	GET_PORTFOLIOS_QUERY: DocumentNode;
	GET_PORTFOLIO_ITEMS_QUERY: DocumentNode;
	CREATE_PORTFOLIO_QUERY: DocumentNode;
	DELETE_PORTFOLIO_QUERY: DocumentNode;
	UPDATE_PORTFOLIO_QUERY: DocumentNode;
	CREATE_PORTFOLIO_ITEMS_QUERY: DocumentNode;
	DELETE_PORTFOLIO_ITEM_QUERY: DocumentNode;
	UPDATE_PORTFOLIO_ITEM_QUERY: DocumentNode;
	GET_VOTES_QUERY: DocumentNode;
	CREATE_VOTE_QUERY: DocumentNode;
	DELETE_VOTE_QUERY: DocumentNode;
}

/**
 * Investor / Authentication Interfaces
 */

export interface InvestorData {
	id: number;
	email?: string;
	date_created?: string;
	nick_name: string;
	first_name?: string;
	last_name?: string;
}

export interface GetInvestorsResponse {
	getInvestors: InvestorData[];
}

export interface CreateInvestorPayload {
	first_name: string;
	last_name: string;
	nick_name: string;
	email: string;
	password: string;
}

export interface CreateAuthPayload {
	investor_id: number | null;
}

export interface GetAuthPayload {
	token: string | null;
}

export interface ValidateInvestorPayload {
	email: string;
	password: string;
}

/**
 * Forum Interfaces
 */

export interface ForumData {
	id: number;
	name: string;
	description: string;
	date_created: string;
	nick_name: string;
	owner_user_id: number;
}
export interface GetForumsResponse {
	getForums: ForumData[];
}

export interface GetForumResponse {
	getForum: ForumData;
}

export interface GetForumPayload {
	id: number;
}

export interface CreateForumResponse {
	createForum: ForumData;
}

export interface CreateForumPayload {
	owner_user_id: number;
	name: string;
	description: string | null;
}

export interface UpdateForumResponse {
	updateForum: ForumData;
}

export interface UpdateForumPayload {
	id: number;
	name?: string;
	description?: string;
}

export interface DeleteForumResponse {
	deleteForum: ForumData;
}

export interface DeleteForumPayload {
	id: number;
}

/**
 * Comment Interfaces
 */

export interface CommentData {
	id: number;
	owner_user_id: number;
	forum_id: number;
	date_created: string;
	description: string;
	likes: string;
	dislikes: string;
	nick_name;
}

export interface GetCommentsResponse {
	getComments: CommentData[];
}

export interface GetCommentsPayload {
	forum_id: number;
}

export interface CreateCommentResponse {
	createComment: CommentData;
}

export interface CreateCommentPayload {
	owner_user_id: number;
	forum_id: number;
	description: string;
}

export interface UpdateCommentResponse {
	updateComment: CommentData;
}

export interface UpdateCommentPayload {
	id: number;
	description?: string;
	likes?: number;
	dislikes?: number;
}

export interface DeleteCommentResponse {
	deleteComment: CommentData;
}

export interface DeleteCommentPayload {
	id: number;
}

/**
 * Room Interfaces
 */
export interface RoomData {
	_id: string;
	owner_user_id: number;
	nick_name: string;
	name: string;
	date_created: string;
	subscribers: number[];
}

export interface GetRoomsResponse {
	getRooms: RoomData[];
}

export interface GetRoomsPayload {
	owner_user_id: number | null;
}

export interface CreateRoomResponse {
	createRoom: RoomData;
}

export interface CreateRoomPayload {
	owner_user_id: number;
	nick_name: string;
	name: string;
	subscribers?: number[];
}

export interface DeleteRoomResponse {
	deleteRoom: RoomData;
}

export interface DeleteRoomPayload {
	_id: string;
}

export interface AddSubscribersResponse {
	addSubscribers: RoomData;
}

export interface AddSubscribersPayload {
	_id: string;
	subscribers: any[];
}

export interface RemoveSubscriberResponse {
	removeSubscriber: RoomData;
}

export interface RemoveSubscriberPayload {
	_id: string;
	subscriber: number | null;
}

export interface SubscribeRoomResponse {
	subscribeRoom: RoomData;
}

export interface UnsubscribeRoomResponse {
	unsubscribeRoom: RoomData;
}

export interface NotifyDeletedRoomResponse {
	notifyDeletedRoom: RoomData;
}

export interface RoomSubscriptionPayload {
	subscriber_id: number | null;
}

/**
 * Message Interfaces
 */

export interface MessageData {
	_id: string;
	_room: string;
	sender_id: number;
	nick_name: string;
	message: string;
	date_created: string;
}

export interface GetMessagesResponse {
	getMessages: MessageData[];
}

export interface GetMessagesPayload {
	_room: string;
}

export interface CreateMessageResponse {
	createMessage: MessageData;
}

export interface CreateMessagePayload {
	_room: string;
	sender_id: number | null;
	nick_name: string | null;
	message: string;
}

export interface DeleteMessageResponse {
	deleteMessage: MessageData;
}

export interface DeleteMessagePayload {
	_id: string;
}

export interface SubscribeMessageResponse {
	subscribeMessage: MessageData;
}

export interface SubscribeMessagePayload {
	_room: string;
	sender_id: number | null;
}

/**
 * Symbol Interfaces
 */
export interface SymbolData {
	id: number;
	name: string;
	is_active: boolean;
	date_created: string;
}

export interface GetSymbolsResponse {
	getSymbols: SymbolData[];
}

/**
 * Summary Interfaces
 */
export interface SummaryData {
	id: number;
	symbol: string;
	sector: string | null;
	long_business_summary: string | null;
	current_price: number | null;
	recommendation_key: string | null;
	target_mean_price: number | null;
	earnings_growth: number | null;
	current_ratio: number | null;
	debt_to_equity: number | null;
	return_on_equity: number | null;
	short_name: string | null;
	price_to_book: number | null;
	forward_pe: number | null;
	dividend_yield: number | null;
}

export interface GetSummariesResponse {
	getSummaries: SummaryData[];
}

export interface GetSummaryPayload {
	symbol_id: number;
}

export interface GetSummaryResponse {
	getSummary: SummaryData;
}

/**
 * Price Interfaces
 */
export interface PriceData {
	id: number;
	symbol_id: number;
	price: number;
	date: number;
}

export interface GetPricesPayload {
	symbol_id: number;
}

export interface GetPricesResponse {
	getPrices: PriceData[];
}

/**
 * Portfolio Interfaces
 */
export interface PortfolioData {
	id: number;
	investor_id: number;
	name: string;
	date_created: string;
}

export interface GetPortfoliosPayload {
	investor_id: number | null;
}

export interface GetPortfoliosResponse {
	getPortfolios: PortfolioData[];
}

export interface CreatePortfolioPayload {
	investor_id: number;
	name: string;
}

export interface CreatePortfolioResponse {
	createPortfolio: PortfolioData;
}

export interface DeletePortfolioPayload {
	id: number;
}

export interface DeletePortfolioResponse {
	deletePortfolio: PortfolioData;
}

export interface UpdatePortfolioPayload {
	id: number;
	name: string;
}

export interface UpdatePortfolioResponse {
	updatePortfolio: PortfolioData;
}

/**
 * Portfolio Item Interfaces
 */
export interface PortfolioItemData {
	id: number;
	portfolio_id: number;
	symbol_id: number;
	date_created: string;
	quantity: number;
	average_cost: number;
	current_price: number;
	short_name: string;
}

export interface GetPortfolioItemsPayload {
	portfolio_id: number;
}

export interface GetPortfolioItemsResponse {
	getPortfolioItems: PortfolioItemData[];
}

export interface CreatePortfolioItemsPayload {
	portfolio_id: number;
	symbol_ids: number[];
}

export interface CreatePortfolioItemsResponse {
	createPortfolioItems: PortfolioItemData[];
}

export interface DeletePortfolioItemPayload {
	id: number;
}

export interface DeletePortfolioItemResponse {
	deletePortfolioItem: PortfolioItemData;
}

export interface UpdatePortfolioItemPayload {
	id: number;
	quantity: number;
	average_cost: number;
}

export interface UpdatePortfolioItemResponse {
	updatePortfolioItem: PortfolioItemData;
}

/**
 * Vote Interfaces
 */
export interface VoteData {
	id: number;
	forum_id: number;
	comment_id: number;
	investor_id: number;
	type: string;
	date_created: string;
}

export interface GetVotesPayload {
	forum_id: number;
	investor_id: number | null;
}

export interface GetVotesResponse {
	getVotes: VoteData[];
}

export interface CreateVotePayload {
	forum_id: number;
	investor_id: number;
	comment_id: number;
	type: 'likes' | 'dislikes';
}

export interface CreateVoteResponse {
	createVote: VoteData;
}

export interface DeleteVotePayload {
	id: number;
}

export interface DeleteVoteResponse {
	deleteVote: VoteData;
}
