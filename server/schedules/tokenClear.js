const cron = require('node-cron');
const db = require('../models/db');
const sql = require('../snippets/sqlQueryGenerator');

deleteSessions = async () => {
  let exp = new Date();
  exp.setDate(exp.getDate() - 1);
  exp = exp.toISOString().slice(0, 10);

  const query = `
  DELETE FROM session WHERE expiration < '${exp}'
  RETURNING id
  `;
  const sqlQuery = sql.getDeleteQuery('authentication', [
    `date_created < '${exp}'`,
  ]);

  const tokens = await db.query(query);

  console.log('Old tokens deleted from authentication table..', tokens.rows);
};

module.exports = () => {
  console.log('Running cron schedule to purge old tokens...');
  cron.schedule('0 0 * * *', () => {
    deleteSessions();
  });
};
