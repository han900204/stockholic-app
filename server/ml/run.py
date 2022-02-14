from Stock import Stock
from dbCon import conn
from feedSymbol import feedSymbol
from registerTickers import registerTickers
from feedSummary import feedSummary
from feedPrice import feedPrice


# Instantiate Stock class
stock = Stock()

# FEED SYMBOLS DATA

feedSymbol(stock, conn)

# REGISTER UPDATED SYMBOLS
'''
NOTE: Symbol needs to be registered in instance of Stock class
before running getSummary and getPrice methods
''' 
symbolDict = registerTickers(stock, conn)

# FEED SUMMARY DATA

feedSummary(stock, conn, symbolDict)

# FEED PRICE DATA

feedPrice(stock, conn, symbolDict)

conn.close()
