import random
import requests
import bs4 as bs
import yfinance as yf
import pandas as pd
from USER_AGENT import user_agent_list

# Delete later
from dbCon import conn

class Stock:

    def __init__(self):
        self.yfTickers = None
        self.summaryFieldMap = {
            "symbol": "symbol",
            "sector": "sector",
            "longBusinessSummary": "long_business_summary",
            "currentPrice": "current_price",
            "recommendationKey": "recommendation_key",
            "targetMeanPrice": "target_mean_price",
            "earningsGrowth": "earnings_growth",
            "currentRatio": "current_ratio",
            "debtToEquity": "debt_to_equity",
            "returnOnEquity": "return_on_equity",
            "shortName": "short_name",
            "52WeekChange": "fifty_two_week_change",
            "priceToBook": "price_to_book",
            "forwardPE": "forward_pe",
            "dividendYield": "dividend_yield",
        }
        self.priceFieldMap = {
            "symbol": "symbol",
            "Close": "price",
            "Date": "date"
        }

    # This method will retrieve the current S&P500 Stock Tickers from Wikipedia
    def getSymbols(self, sampling=False):
        # Sampling for Testing Purpose
        if sampling:
            return ['AAPL', 'TSLA', 'AMZN', 'MSFT', 'GOOGL', 'BAC', 'CNQ', 'AMD']

        # Rotate User Agents To Avoid of Access Block
        user_agent = random.choice(user_agent_list)
        header = {'User-Agent': user_agent}

        # Send a GET request to Wikipedia
        request_url = requests.get(
            'http://en.wikipedia.org/wiki/List_of_S%26P_500_companies', headers=header)

        # Extract Stock Tickers from the Table
        get_html = bs.BeautifulSoup(request_url.text, 'lxml')
        get_table = get_html.find(
            'table', attrs={'class': 'wikitable sortable'})
        tickers = []
        for row in get_table.findAll('tr')[1:]:
            ticker = row.findAll('td')[0].text.strip()
            tickers.append(ticker)

        return tickers

    # This method will register yfinance tickers
    def registerTickers(self, symbols):
        '''
        symbols: list of stock symbols
        '''
        try:
            symbols = " ".join(symbols)
        
            self.yfTickers = yf.Tickers(symbols)

            print("Tickers registered successfully")
        except Exception as e:
            print("Ticker registration failed: \n\n", e)


    # This method will retrieve the stock summary data from yfinance
    def getSummary(self):
        
        summary = []

        for yfTicker in self.yfTickers.tickers:
            summaryData = self.yfTickers.tickers[yfTicker].info

            filteredSummary = {}

            # Rename columns to match db schema
            for item in self.summaryFieldMap.items():
                filteredSummary[item[1]] = summaryData[item[0]]

            summary.append(filteredSummary)

        return summary

    # This method will retrieve the stock price data from yfinance
    def getPrice(self):
        '''
        symbols: list of stock symbols
        '''
        
        price = []

        for yfTicker in self.yfTickers.tickers:
            # Get 5 days stock data
            priceData = self.yfTickers.tickers[yfTicker].history(period='5d') # Default to be 5d
            # Convert Data index to column
            priceData.reset_index(level=['Date'], inplace=True)
            # Add symbol column
            priceData['symbol'] = yfTicker
            # Filter by required coloumns and rename columns to match db schema
            priceData = priceData.filter(items=self.priceFieldMap.keys(), axis=1)
            priceData.rename(mapper=self.priceFieldMap, axis=1, inplace=True)
            # Convert dataframe to dict
            priceData = priceData.to_dict(orient='index')
            
            for data in priceData.values():
                price.append(data)
        
        return price