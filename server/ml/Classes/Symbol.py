import random
import requests
import bs4 as bs
import sys
import os
sys.path.append(os.path.join(sys.path[0], 'constants'))
from constants import USER_AGENT

class Symbol:

    # This function will retrieve the current S&P500 Stock Tickers from Wikipedia
    def getSymbols(self, sampling=False):
        # Sampling for Testing Purpose
        if sampling:
            return ['AAPL', 'TSLA', 'AMZN', 'MSFT']

        # Rotate User Agents To Avoid of Access Block
        user_agent = random.choice(USER_AGENT.user_agent_list)
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
