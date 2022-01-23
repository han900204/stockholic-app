const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLFloat,
} = require("graphql");

/**
 * Load .env file
 */
if (process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

/**
 * Yahoo Finance API Information
 */
const API = process.env.YFIN_API_KEY;
const trendUrl = "https://yfapi.net/v1/finance/trending/US";
const quoteUrl =
  "https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=";
const similarStockUrl = "https://yfapi.net/v6/finance/recommendationsbysymbol/";
const insightUrl = "https://yfapi.net/ws/insights/v1/finance/insights?symbol=";
const summaryUrl =
  "https://yfapi.net/v6/finance/quote/marketSummary?lang=en&region=US";
const header = {
  accept: "application/json",
  "X-API-KEY": API,
};

const FormatType = new GraphQLObjectType({
  name: "Format",
  fields: () => ({
    fmt: { type: GraphQLString },
    raw: { type: GraphQLFloat },
  }),
});

const SummaryType = new GraphQLObjectType({
  name: "Summary",
  fields: () => ({
    exchange: { type: GraphQLString },
    shortName: { type: GraphQLString },
    symbol: { type: GraphQLString },
    region: { type: GraphQLString },
    regularMarketChange: { type: FormatType },
    regularMarketChangePercent: { type: FormatType },
    regularMarketPreviousClose: { type: FormatType },
    regularMarketPrice: { type: FormatType },
  }),
});

const TrendingStockType = new GraphQLObjectType({
  name: "TrendingStock",
  fields: () => ({
    symbol: { type: GraphQLString },
  }),
});

const StockQuoteType = new GraphQLObjectType({
  name: "StockQuote",
  fields: () => ({
    symbol: { type: GraphQLString },
    shortName: { type: GraphQLString },
    forwardPE: { type: GraphQLFloat },
    priceToBook: { type: GraphQLFloat },
    regularMarketPrice: { type: GraphQLFloat },
    epsCurrentYear: { type: GraphQLFloat },
    fiftyDayAverageChangePercent: { type: GraphQLFloat },
    twoHundredDayAverageChangePercent: { type: GraphQLFloat },
    trailingAnnualDividendYield: { type: GraphQLFloat },
  }),
});

const SimilarStockType = new GraphQLObjectType({
  name: "SimilarStock",
  fields: () => ({
    symbol: { type: GraphQLString },
    score: { type: GraphQLFloat },
  }),
});

const InsightType = new GraphQLObjectType({
  name: "Insight",
  fields: () => ({
    symbol: { type: GraphQLString },
    report: { type: new GraphQLList(ReportType) },
    recommendation: { type: RecommendationType },
    sector: { type: GraphQLString },
  }),
});

const ReportType = new GraphQLObjectType({
  name: "Report",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    provider: { type: GraphQLString },
    publishedOn: { type: GraphQLString },
    summary: { type: GraphQLString },
  }),
});

const RecommendationType = new GraphQLObjectType({
  name: "Recommendation",
  fields: () => ({
    targetPrice: { type: GraphQLFloat },
    provider: { type: GraphQLString },
    rating: { type: GraphQLString },
  }),
});

/**
 * Root Query
 */

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    summary: {
      type: new GraphQLList(SummaryType),
      async resolve(parent, args) {
        const res = await axios.get(summaryUrl, { headers: header });
        return res.data.marketSummaryResponse.result;
      },
    },
    trendingStock: {
      type: new GraphQLList(TrendingStockType),
      async resolve(parent, args) {
        const res = await axios.get(trendUrl, { headers: header });
        return res.data.finance.result[0].quotes;
      },
    },
    stockQuote: {
      type: new GraphQLList(StockQuoteType),
      args: {
        symbols: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        let resultArr = await Promise.all(
          args.symbols.map(async (symbol) => {
            const res = await axios.get(`${quoteUrl}${symbol}`, {
              headers: header,
            });
            return res.data.quoteResponse.result[0];
          })
        );
        /**
         * Filter out undefined
         */
        resultArr = resultArr.filter((data) => data !== undefined);
        return resultArr;
      },
    },
    similarStock: {
      type: new GraphQLList(SimilarStockType),
      args: {
        symbol: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const res = await axios.get(`${similarStockUrl}${args.symbol}`, {
          headers: header,
        });
        return res.data.finance.result[0].recommendedSymbols;
      },
    },
    insight: {
      type: InsightType,
      args: {
        symbol: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const res = await axios.get(`${insightUrl}${args.symbol}`, {
          headers: header,
        });
        const report = res.data.finance.result.reports;
        const recommendation =
          res.data.finance.result.instrumentInfo.recommendation;
        const sector = res.data.finance.result.companySnapshot.sectorInfo;
        const insight = {
          symbol: args.symbol,
          report: report,
          recommendation: recommendation,
          sector: sector,
        };
        return insight;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
});
