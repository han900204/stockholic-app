import yfinance as yf

msft = yf.Ticker("MSFT")

# get stock info
# print(msft.info.keys())
# print(msft.financials)
# print(msft.balance_sheet)

# tickers = yf.Tickers("MSFT AAPL")

# for ticker in tickers.tickers:
#   print(ticker, tickers.tickers[ticker].history(period='1mo'))

hist = msft.history(period="1mo")
print(hist)

# data = yf.download(  # or pdr.get_data_yahoo(...
#         # tickers list or string as well
#         tickers = "AAPL MSFT",

#         # use "period" instead of start/end
#         # valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
#         # (optional, default is '1mo')
#         period = "1y",

#         # fetch data by interval (including intraday if period < 60 da
# ys)
#         # valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
#         # (optional, default is '1d')
#         interval = "1m",

#         # group by ticker (to access via data['SPY'])
#         # (optional, default is 'column')
#         group_by = 'ticker',

#         # adjust all OHLC automatically
#         # (optional, default is False)
#         auto_adjust = True,

#         # download pre/post regular market hours data
#         # (optional, default is False)
#         prepost = True,

#         # use threads for mass downloading? (True/False/Integer)
#         # (optional, default is True)
#         threads = True,

#         # proxy URL scheme use use when downloading?
#         # (optional, default is None)
#         proxy = None
#     )

# print(data)

# data = yf.download(tickers="AAPL MSFT", period="ytd", interval="1d")
# print(data)