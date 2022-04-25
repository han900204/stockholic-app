const { GraphQLObjectType, GraphQLSchema } = require('graphql');
const investor = require('./schema/investorSchema');
const authentication = require('./schema/authenticationSchema');
const forum = require('./schema/forumSchema');
const comment = require('./schema/commentSchema');
const room = require('./schema/roomSchema');
const message = require('./schema/messageSchema');
const symbol = require('./schema/symbolSchema');
const summary = require('./schema/summarySchema');
const price = require('./schema/priceSchema');
const portfolio = require('./schema/portfolioSchema');
const portfolioItem = require('./schema/portfolioItemSchema');
const vote = require('./schema/voteSchema');
const s3 = require('./schema/s3Schema');

/**
 * Root Query
 */
const RootQueryType = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		getInvestor: investor.query.getInvestor,
		getInvestors: investor.query.getInvestors,
		getAuthentication: authentication.query.getAuthentication,
		getForums: forum.query.getForums,
		getForum: forum.query.getForum,
		getComments: comment.query.getComments,
		getRooms: room.query.getRooms,
		getMessages: message.query.getMessages,
		getSymbols: symbol.query.getSymbols,
		getSummaries: summary.query.getSummaries,
		getSummary: summary.query.getSummary,
		getPrices: price.query.getPrices,
		getPortfolios: portfolio.query.getPortfolios,
		getPortfolioItems: portfolioItem.query.getPortfolioItems,
		getVotes: vote.query.getVotes,
	},
});

const RootMutationType = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		createInvestor: investor.mutation.postInvestor,
		validateInvestor: investor.mutation.validateInvestor,
		updateProfilePicture: investor.mutation.updateProfilePicture,
		createAuthentication: authentication.mutation.postAuthentication,
		deleteAuthentication: authentication.mutation.deleteAuthentication,
		createForum: forum.mutation.postForum,
		deleteForum: forum.mutation.deleteForum,
		updateForum: forum.mutation.updateForum,
		createComment: comment.mutation.postComment,
		deleteComment: comment.mutation.deleteComment,
		updateComment: comment.mutation.updateComment,
		createRoom: room.mutation.postRoom,
		deleteRoom: room.mutation.deleteRoom,
		createMessage: message.mutation.postMessage,
		deleteMessage: message.mutation.deleteMessage,
		addSubscribers: room.mutation.addSubscribers,
		removeSubscriber: room.mutation.removeSubscriber,
		createPortfolio: portfolio.mutation.postPortfolio,
		deletePortfolio: portfolio.mutation.deletePortfolio,
		updatePortfolio: portfolio.mutation.updatePortfolio,
		createPortfolioItems: portfolioItem.mutation.postPortfolioItems,
		deletePortfolioItem: portfolioItem.mutation.deletePortfolioItem,
		updatePortfolioItem: portfolioItem.mutation.updatePortfolioItem,
		createVote: vote.mutation.postVote,
		deleteVote: vote.mutation.deleteVote,
		signS3: s3.mutation.signS3,
	},
});

const RootSubscriptionType = new GraphQLObjectType({
	name: 'RootSubscription',
	fields: {
		subscribeRoom: room.subscription.subscribeRoom,
		unsubscribeRoom: room.subscription.unsubscribeRoom,
		notifyDeletedRoom: room.subscription.notifyDeletedRoom,
		subscribeMessage: message.subscription.subscribeMessage,
	},
});

module.exports = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType,
	subscription: RootSubscriptionType,
});
