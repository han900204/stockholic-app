const { Pool } = require("pg");

if (process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const PG_URL = process.env.ELEPHANTSQL_URL;
const pool = new Pool({
  connectionString: PG_URL,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
