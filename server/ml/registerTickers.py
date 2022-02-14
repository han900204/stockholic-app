import time


def registerTickers(stock, conn):
  '''
  stock - instance of Stock class
  cur - db connection cursor
  '''
  # REGISTER UPDATED SYMBOLS
  start_time = time.time()
  cur = conn.cursor()

  # Get updated symbols from db
  cur.execute("""SELECT * FROM symbol""")
  symbolDbRecords = cur.fetchall()

  # Dict for existing symbol name / id pair
  symbolDict = {}
  for data in symbolDbRecords:
    symbolDict[data[1]] = data[0]

  # Register updated symbols in stock object
  stock.registerTickers(symbolDict.keys())

  print("--- %s seconds ---" % (time.time() - start_time))
  
  return symbolDict