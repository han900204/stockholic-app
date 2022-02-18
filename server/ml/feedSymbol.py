import time

def feedSymbol(stock, conn):
  '''
  stock - instance of Stock class
  cur - db connection cursor
  '''
  # FEED SYMBOLS DATA
  start_time = time.time()
  cur = conn.cursor()

  # Get stock symbols
  symbols = stock.getSymbols(True)

  # To store data for db upload
  rows = ()

  # Get symbols from db
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

  print("--- %s seconds ---" % (time.time() - start_time))