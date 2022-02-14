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
            "52WeekChange": "52_week_change",
            "priceToBook": "price_to_book",
            "forwardPE": "forward_pe",
            "dividendYield": "dividend_yield",
        }

    # This function will retrieve the current S&P500 Stock Tickers from Wikipedia
    def getSymbols(self, sampling=False):
        # Sampling for Testing Purpose
        if sampling:
            return ['AAPL', 'TSLA', 'AMZN', 'MSFT']

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

    # This function will retrieve the stock summary data from yfinance
    def getSummary(self, symbols):
        '''
        symbols: list of stock symbols
        '''
        symbols = " ".join(symbols)
        
        yfTickers = yf.Tickers(symbols)

        summary = []

        for yfTicker in yfTickers.tickers:
            summaryData = yfTickers.tickers[yfTicker].info
            filteredSummary = {}

            for item in self.summaryFieldMap.items():
                filteredSummary[item[1]] = summaryData[item[0]]

            summary.append(filteredSummary)
        return summary


