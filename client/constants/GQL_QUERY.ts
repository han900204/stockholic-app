import { gql } from '@apollo/client';
import { QueryInterface } from './GQL_INTERFACE';

const GQL_QUERY: QueryInterface = {
	/**
	 * User and auth query
	 */
	CREATE_INVESTOR_QUERY: gql`
		mutation CreateInvestor(
			$first_name: String!
			$last_name: String!
			$nick_name: String!
			$email: String!
			$password: String!
		) {
			createInvestor(
				first_name: $first_name
				last_name: $last_name
				nick_name: $nick_name
				email: $email
				password: $password
			) {
				id
				nick_name
			}
		}
	`,
	CREATE_AUTH_QUERY: gql`
		mutation CreateAuthentication($investor_id: Int!) {
			createAuthentication(investor_id: $investor_id) {
				token
			}
		}
	`,

	GET_AUTHENTICATION_QUERY: gql`
		query GetAuthentication($token: String) {
			getAuthentication(token: $token) {
				investor_id
				nick_name
			}
		}
	`,
	VALIDATE_INVESTOR_QUERY: gql`
		mutation ValidateInvestor($email: String!, $password: String!) {
			validateInvestor(email: $email, password: $password) {
				id
				nick_name
			}
		}
	`,
	GET_INVESTOR_QUERY: gql`
		query GetInvestor($id: Int!) {
			getInvestor(id: $id) {
				id
				first_name
				last_name
				nick_name
				email
				date_created
			}
		}
	`,
	GET_INVESTORS_QUERY: gql`
		query GetInvestors {
			getInvestors {
				id
				nick_name
			}
		}
	`,

	DELETE_AUTH_QUERY: gql`
		mutation DeleteAuthentication($token: String) {
			deleteAuthentication(token: $token) {
				id
			}
		}
	`,

	/**
	 * Forum query
	 */

	GET_FORUMS_QUERY: gql`
		query GetForums {
			getForums {
				id
				name
				description
				date_created
				nick_name
				owner_user_id
			}
		}
	`,

	GET_FORUM_QUERY: gql`
		query GetForum($id: Int!) {
			getForum(id: $id) {
				id
				name
				owner_user_id
				description
				date_created
				nick_name
			}
		}
	`,

	CREATE_FORUM_QUERY: gql`
		mutation CreateForum(
			$owner_user_id: Int!
			$name: String!
			$description: String
		) {
			createForum(
				owner_user_id: $owner_user_id
				name: $name
				description: $description
			) {
				id
				name
				description
				date_created
				nick_name
				owner_user_id
			}
		}
	`,

	UPDATE_FORUM_QUERY: gql`
		mutation UpdateForum($id: Int!, $name: String, $description: String) {
			updateForum(id: $id, name: $name, description: $description) {
				id
				name
				description
				date_created
				nick_name
				owner_user_id
			}
		}
	`,
	DELETE_FORUM_QUERY: gql`
		mutation DeleteForum($id: Int!) {
			deleteForum(id: $id) {
				id
				name
				description
				date_created
				nick_name
				owner_user_id
			}
		}
	`,

	/**
	 * Comment query
	 */

	GET_COMMENTS_QUERY: gql`
		query GetComments($forum_id: Int!) {
			getComments(forum_id: $forum_id) {
				id
				owner_user_id
				forum_id
				date_created
				description
				likes
				dislikes
				nick_name
			}
		}
	`,

	CREATE_COMMENT_QUERY: gql`
		mutation CreateComment(
			$owner_user_id: Int!
			$forum_id: Int!
			$description: String!
		) {
			createComment(
				owner_user_id: $owner_user_id
				forum_id: $forum_id
				description: $description
			) {
				id
				owner_user_id
				forum_id
				date_created
				description
				likes
				dislikes
				nick_name
			}
		}
	`,

	UPDATE_COMMENT_QUERY: gql`
		mutation UpdateComment(
			$id: Int!
			$description: String
			$likes: Int
			$dislikes: Int
		) {
			updateComment(
				id: $id
				description: $description
				likes: $likes
				dislikes: $dislikes
			) {
				id
				owner_user_id
				forum_id
				date_created
				description
				likes
				dislikes
				nick_name
			}
		}
	`,

	DELETE_COMMENT_QUERY: gql`
		mutation DeleteComment($id: Int!) {
			deleteComment(id: $id) {
				id
				owner_user_id
				forum_id
				date_created
				description
				likes
				dislikes
				nick_name
			}
		}
	`,
	/**
	 * Room query
	 */

	GET_ROOMS_QUERY: gql`
		query GetRooms($owner_user_id: Int!) {
			getRooms(owner_user_id: $owner_user_id) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	CREATE_ROOM_QUERY: gql`
		mutation CreateRoom(
			$owner_user_id: Int!
			$nick_name: String!
			$name: String!
			$subscribers: [Int!]
		) {
			createRoom(
				owner_user_id: $owner_user_id
				nick_name: $nick_name
				name: $name
				subscribers: $subscribers
			) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	DELETE_ROOM_QUERY: gql`
		mutation DeleteRoom($_id: String!) {
			deleteRoom(_id: $_id) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	ADD_SUBSCRIBERS_QUERY: gql`
		mutation AddSubscribers(
			$_id: String!
			$subscribers: [Int!]
			$inviter: String!
		) {
			addSubscribers(_id: $_id, subscribers: $subscribers, inviter: $inviter) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	REMOVE_SUBSCRIBER_QUERY: gql`
		mutation RemoveSubscriber($_id: String!, $subscriber: Int!) {
			removeSubscriber(_id: $_id, subscriber: $subscriber) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	SUBSCRIBE_ROOM_QUERY: gql`
		subscription SubscribeRoom($subscriber_id: Int!) {
			subscribeRoom(subscriber_id: $subscriber_id) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	UNSUBSCRIBE_ROOM_QUERY: gql`
		subscription UnsubscribeRoom($subscriber_id: Int!) {
			unsubscribeRoom(subscriber_id: $subscriber_id) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	NOTIFY_DELETED_ROOM_QUERY: gql`
		subscription NotifyDeletedRoom($subscriber_id: Int!) {
			notifyDeletedRoom(subscriber_id: $subscriber_id) {
				_id
				owner_user_id
				nick_name
				name
				date_created
				subscribers
			}
		}
	`,

	/**
	 * Message query
	 */

	GET_MESSAGES_QUERY: gql`
		query GetMessages($_room: String!) {
			getMessages(_room: $_room) {
				_id
				_room
				sender_id
				nick_name
				message
				date_created
			}
		}
	`,

	CREATE_MESSAGE_QUERY: gql`
		mutation CreateMessage(
			$_room: String!
			$sender_id: Int!
			$nick_name: String!
			$message: String!
		) {
			createMessage(
				_room: $_room
				sender_id: $sender_id
				nick_name: $nick_name
				message: $message
			) {
				_id
				_room
				sender_id
				nick_name
				message
				date_created
			}
		}
	`,

	DELETE_MESSAGE_QUERY: gql`
		mutation DeleteMessage($_id: String!) {
			deleteMessage(_id: $_id) {
				_id
				_room
				sender_id
				nick_name
				message
				date_created
			}
		}
	`,
	SUBSCRIBE_MESSAGE: gql`
		subscription SubscribeMessage($_room: String!, $sender_id: Int!) {
			subscribeMessage(_room: $_room, sender_id: $sender_id) {
				_id
				_room
				sender_id
				nick_name
				message
				date_created
			}
		}
	`,

	GET_SYMBOLS_QUERY: gql`
		query GetSymbols {
			getSymbols {
				id
				name
				is_active
				date_created
			}
		}
	`,

	GET_SUMMARIES_QUERY: gql`
		query GetSummaries {
			getSummaries {
				id: symbol_id
				symbol: name
				sector
				long_business_summary
				current_price
				recommendation_key
				target_mean_price
				earnings_growth
				current_ratio
				debt_to_equity
				return_on_equity
				short_name
				price_to_book
				forward_pe
				dividend_yield
			}
		}
	`,

	GET_SUMMARY_QUERY: gql`
		query GetSummary($symbol_id: Int!) {
			getSummary(symbol_id: $symbol_id) {
				id: symbol_id
				symbol: name
				sector
				long_business_summary
				current_price
				recommendation_key
				target_mean_price
				earnings_growth
				current_ratio
				debt_to_equity
				return_on_equity
				short_name
				price_to_book
				forward_pe
				dividend_yield
			}
		}
	`,

	GET_PRICES_QUERY: gql`
		query GetPrices($symbol_id: Int!) {
			getPrices(symbol_id: $symbol_id) {
				id
				symbol_id
				price
				date
			}
		}
	`,

	/**
	 * Portfolio query
	 */

	GET_PORTFOLIOS_QUERY: gql`
		query GetPortfolios($investor_id: Int!) {
			getPortfolios(investor_id: $investor_id) {
				id
				investor_id
				name
				date_created
			}
		}
	`,

	CREATE_PORTFOLIO_QUERY: gql`
		mutation CreatePortfolio($investor_id: Int!, $name: String!) {
			createPortfolio(investor_id: $investor_id, name: $name) {
				id
				investor_id
				name
				date_created
			}
		}
	`,

	UPDATE_PORTFOLIO_QUERY: gql`
		mutation UpdatePortfolio($id: Int!, $name: String) {
			updatePortfolio(id: $id, name: $name) {
				id
				investor_id
				name
				date_created
			}
		}
	`,
	DELETE_PORTFOLIO_QUERY: gql`
		mutation DeletePortfolio($id: Int!) {
			deletePortfolio(id: $id) {
				id
				investor_id
				name
				date_created
			}
		}
	`,

	/**
	 * Portfolio item query
	 */

	GET_PORTFOLIO_ITEMS_QUERY: gql`
		query GetPortfolioItems($portfolio_id: Int!) {
			getPortfolioItems(portfolio_id: $portfolio_id) {
				id
				portfolio_id
				symbol_id
				date_created
				quantity
				average_cost
				current_price
				short_name
			}
		}
	`,

	CREATE_PORTFOLIO_ITEMS_QUERY: gql`
		mutation CreatePortfolioItems($portfolio_id: Int!, $symbol_ids: [Int!]) {
			createPortfolioItems(
				portfolio_id: $portfolio_id
				symbol_ids: $symbol_ids
			) {
				id
				portfolio_id
				symbol_id
				date_created
				quantity
				average_cost
				current_price
				short_name
			}
		}
	`,

	UPDATE_PORTFOLIO_ITEM_QUERY: gql`
		mutation UpdatePortfolioItem(
			$id: Int!
			$quantity: Int!
			$average_cost: Float!
		) {
			updatePortfolioItem(
				id: $id
				quantity: $quantity
				average_cost: $average_cost
			) {
				id
				portfolio_id
				symbol_id
				date_created
				quantity
				average_cost
				current_price
				short_name
			}
		}
	`,
	DELETE_PORTFOLIO_ITEM_QUERY: gql`
		mutation DeletePortfolioItem($id: Int!) {
			deletePortfolioItem(id: $id) {
				id
				portfolio_id
				symbol_id
				date_created
				quantity
				average_cost
				current_price
				short_name
			}
		}
	`,

	/**
	 * Vote query
	 */

	GET_VOTES_QUERY: gql`
		query GetVotes($investor_id: Int!, $forum_id: Int!) {
			getVotes(investor_id: $investor_id, forum_id: $forum_id) {
				id
				forum_id
				comment_id
				investor_id
				type
				date_created
			}
		}
	`,

	CREATE_VOTE_QUERY: gql`
		mutation CreateVote(
			$investor_id: Int!
			$comment_id: Int!
			$type: String!
			$forum_id: Int!
		) {
			createVote(
				investor_id: $investor_id
				comment_id: $comment_id
				type: $type
				forum_id: $forum_id
			) {
				id
				forum_id
				comment_id
				investor_id
				type
				date_created
			}
		}
	`,

	DELETE_VOTE_QUERY: gql`
		mutation DeleteVote($id: Int!) {
			deleteVote(id: $id) {
				id
				forum_id
				comment_id
				investor_id
				type
				date_created
			}
		}
	`,
};

export default GQL_QUERY;
