from Stock import Stock
from dbCon import conn

stock = Stock()

# UPDATE SYMBOLS

# Get stock symbols
symbols = stock.getSymbols(True)

# To store data for db upload
rows = ()

# Get symbols from db
cur = conn.cursor()
# cur.execute("""SELECT * FROM symbol""")
# dbRecords = cur.fetchall()
# dbRecords = [data[1] for data in dbRecords]

# # Exclude existing symbols in db from upload
# symbols = [s for s in symbols if s not in dbRecords]

# if len(symbols) > 0:
#   for s in symbols:
#     rows += ((s,),)

#   args_str = ','.join(cur.mogrify("(%s)", x).decode("utf-8") for x in rows)

#   try:
#     cur.execute("INSERT INTO symbol (name) VALUES " + args_str)
#     conn.commit()
#     print("Query to add symbols successful for ", symbols)
#   except Exception as e:
#     print(e)
#     print("Query to add symbols failed for ", symbols)
# else:
#   print("There is no new symbols to update DB")

# UPDATE SUMMARY

# Get updated symbols from db
cur.execute("""SELECT * FROM symbol""")
symbolDbRecords = cur.fetchall()

# Dict for symbol name / id pair
symbolDict = {}
for data in symbolDbRecords:
  symbolDict[data[1]] = data[0]

# Get stock summary
summary = stock.getSummary([data[1] for data in symbolDbRecords])

# Get summary from db
cur.execute("""SELECT * FROM stock_summary""")
summaryDbRecords = cur.fetchall()
existingSymbols = [data[1] for data in summaryDbRecords]

# To store multiple record data for db upload
updateRows = ()
insertRows = ()

# Check if summary record already exists in db
for record in summary:
  # If summary exists, update in db
  if symbolDict[record['symbol']] in existingSymbols:
    record['symbol_id'] = symbolDict[record['symbol']]
    del record['symbol']

    # To store a record data for db upload
    row = ()
    for item in record.items():
      row += (item[1],)

    updateRows += (row,)
  # If summary not exists, insert to db
  else:
    record['symbol_id'] = symbolDict[record['symbol']]
    del record['symbol']

    # To store a record data for db upload
    row = ()
    for item in record.items():
      row += (item[1],)

    insertRows += (row,)

# Insert summary records in db  
args_str = ','.join(cur.mogrify("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", x).decode("utf-8") for x in updateRows)

try:
  cur.execute('INSERT INTO stock_summary (sector, long_business_summary, \
    current_price, recommendation_key, target_mean_price,\
       earnings_growth, current_ratio, debt_to_equity, \
         return_on_equity, short_name, "52_week_change", \
           price_to_book, forward_pe, dividend_yield, symbol_id) VALUES ' + args_str)
  conn.commit()
  print("Query to add summary successful")
except Exception as e:
  print(e)
  print("Query to add symbols failed")
  








conn.close()
