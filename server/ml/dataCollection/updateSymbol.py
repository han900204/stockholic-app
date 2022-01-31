import sys
import os
sys.path.append(os.path.abspath(os.path.join(sys.path[0], os.pardir, 'Classes')))
sys.path.append(os.path.abspath(os.path.join(sys.path[0], os.pardir, 'db')))
from Symbol import Symbol
from connection import conn

# Get Stock Symbols
symbols = Symbol().getSymbols(True)

# Prepare dictionary for db upload
rows = ()

# Update Symbols in DB
cur = conn.cursor()
cur.execute("""SELECT * FROM symbol""")
dbRecords = cur.fetchall()
dbRecords = [data[1] for data in dbRecords]

# Exclude existing symbols in db from upload
symbols = [s for s in symbols if s not in dbRecords]

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

conn.close()

