from Stock import Stock
import psycopg2.extras
from dbCon import conn
import time
start_time = time.time()

stock = Stock()

# FEED SYMBOLS DATA

# Get stock symbols
symbols = stock.getSymbols(True)

# To store data for db upload
rows = ()

# Get symbols from db
cur = conn.cursor()
cur.execute("""SELECT * FROM symbol""")
dbRecords = cur.fetchall()
dbRecords = [data[1] for data in dbRecords]

# Exclude existing symbols in db from upload
symbols = [s for s in symbols if s not in dbRecords]

# Add symbols to db
if len(symbols) > 0:
  for s in symbols:
    rows += ((s,),)

  args_str = ','.join(cur.mogrify("(%s)", x).decode("utf-8") for x in rows)

  try:
    cur.execute("INSERT INTO symbol (name) VALUES " + args_str)
    conn.commit()
    print("Query to add symbols successful for ", symbols)
  except Exception as e:
    print(e)
    print("Query to add symbols failed for ", symbols)
else:
  print("There is no new symbols to update DB")

# FEED SUMMARY DATA

# Get updated symbols from db
cur.execute("""SELECT * FROM symbol""")
symbolDbRecords = cur.fetchall()

# Dict for existing symbol name / id pair
symbolDict = {}
for data in symbolDbRecords:
  symbolDict[data[1]] = data[0]

# Register updated symbols in stock object
stock.registerTickers(symbolDict.keys())

# Get stock summary
summary = stock.getSummary()

# Get summary from db
cur.execute("""SELECT * FROM stock_summary""")
summaryDbRecords = cur.fetchall()

# Dict for existing summary symbol_id / id pair
summaryDict = {}
for data in summaryDbRecords:
  summaryDict[data[1]] = data[0]

# To store multiple record data for db upload
updateRows = ()
insertRows = ()

# Check if summary record already exists in db
for record in summary:
  # If summary exists, update in db
  symbolId = symbolDict[record['symbol']]
  if symbolId in summaryDict:
    record['symbol_id'] = symbolId
    record['id'] = summaryDict[symbolId]
    del record['symbol']

    # To store a record data for db upload
    row = ()
    for item in record.items():
      if item[1] == 'None':
        row += (None,)
      else:
        row += (item[1],)

    updateRows += (row,)
  # If summary not exists, insert to db
  else:
    record['symbol_id'] = symbolDict[record['symbol']]
    del record['symbol']

    # To store a record data for db upload
    row = ()
    for item in record.items():
      if item[1] == 'None':
        row += (None,)
      else:
        row += (item[1],)

    insertRows += (row,)

# Insert summary records in db 
if len(insertRows) > 0:

  args_str = ','.join(cur.mogrify("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", x).decode("utf-8") for x in insertRows)

  try:
    cur.execute('INSERT INTO stock_summary (sector, long_business_summary, \
      current_price, recommendation_key, target_mean_price,\
        earnings_growth, current_ratio, debt_to_equity, \
          return_on_equity, short_name, fifty_two_week_change, \
            price_to_book, forward_pe, dividend_yield, symbol_id) VALUES ' + args_str)
    conn.commit()
    print("Query to add summary successful")
  except Exception as e:
    print(e)
    print("Query to add symbols failed")
else:
  print("There is no new summary to insert")

# Update summary records in db  
if len(updateRows) > 0:

  try:
    update_query = """UPDATE stock_summary AS s
                    SET sector = data.sector,
                    long_business_summary = data.long_business_summary,
                    current_price = data.current_price,
                    recommendation_key = data.recommendation_key,
                    target_mean_price = data.target_mean_price,
                    earnings_growth = data.earnings_growth,
                    current_ratio = data.current_ratio,
                    debt_to_equity = data.debt_to_equity,
                    return_on_equity = data.return_on_equity,
                    short_name = data.short_name,
                    fifty_two_week_change = data.fifty_two_week_change,
                    price_to_book = data.price_to_book,
                    forward_pe = data.forward_pe,
                    dividend_yield = data.dividend_yield,
                    symbol_id = data.symbol_id
                    FROM (VALUES %s) AS data(sector,
                    long_business_summary,
                    current_price,
                    recommendation_key,
                    target_mean_price,
                    earnings_growth,
                    current_ratio,
                    debt_to_equity,
                    return_on_equity,
                    short_name,
                    fifty_two_week_change,
                    price_to_book,
                    forward_pe,
                    dividend_yield,
                    symbol_id,
                    id) 
                    WHERE s.id = data.id"""

    psycopg2.extras.execute_values(cur, update_query, updateRows, template=None, page_size=100)
    conn.commit()
    print("Query to update summary successful")
  except Exception as e:
    print(e)
    print("Query to update symbols failed")
else:
  print("There are no summary to update")

conn.close()

print("--- %s seconds ---" % (time.time() - start_time))