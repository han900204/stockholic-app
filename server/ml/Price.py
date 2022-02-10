import yfinance as yf

class Price:
  def getPrice(self, symbols):
    msft = yf.Ticker("MSFT")
    

test = Price()

test.getPrice()