from Stock import Stock
from dbCon import conn
from feedSymbol import feedSymbol
from registerTickers import registerTickers
from feedSummary import feedSummary
import datetime

cur = conn.cursor()

# Instantiate Stock class
stock = Stock()

# # FEED SYMBOLS DATA

# feedSymbol(stock, conn)

# REGISTER UPDATED SYMBOLS
'''
NOTE: Symbol needs to be registered in instance of Stock class
before running getSummary and getPrice methods
''' 
symbolDict = registerTickers(stock, conn)

# # FEED SUMMARY DATA

# feedSummary(stock, conn, symbolDict)

# FEED PRICE DATA

# Get price
price = stock.getPrice()

# Get price from db
today = datetime.date.today()
delta = datetime.timedelta(days = 6)
targetDate = today - delta

cur.execute("""SELECT * FROM stock_price WHERE date >= %s""", (targetDate,))
priceDbRecords = cur.fetchall()

# Dict for existing summary symbol_id / id pair
priceDict = {}
for data in priceDbRecords:
  priceDict[str(data[1]) + '#' + data[3].strftime('%Y-%m-%d')] = None

# To store multiple record data for db upload
rows = ()
countOfDup = 0
countOfUnique = 0

for record in price:
  symbolId = symbolDict[record['symbol']]
  record['symbol_id'] = symbolId
  del record['symbol']

  dupCheckKey = str(record['symbol_id']) + '#' + record['date'].strftime('%Y-%m-%d')
  
  if dupCheckKey in priceDict:
    countOfDup += 1
  else:
    # To store a record data for db upload
    row = ()
    for item in record.items():
      if item[1] == 'None':
        row += (None,)
      else:
        row += (item[1],)

    rows += (row,)
    countOfUnique += 1

print('Price record validation: Unique records = ', countOfUnique, 'Duplicate records = ', countOfDup)
 

# # Insert summary records in db 
# if len(rows) > 0:

#   args_str = ','.join(cur.mogrify("(%s, %s, %s)", x).decode("utf-8") for x in rows)

#   try:
#     cur.execute('INSERT INTO stock_price (price, date, symbol_id) VALUES ' + args_str)
#     conn.commit()
#     print("Query to add price successful")
#   except Exception as e:
#     print(e)
#     print("Query to add price failed")
# else:
#   print("There is no new price to insert")



conn.close()
