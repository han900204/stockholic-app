const cron = require('node-cron');
const db = require('../models/db');

deleteSessions = async () => {
  // let exp = new Date();
  // exp.setDate(exp.getDate() - 1);
  // exp = exp.toISOString().slice(0, 10);
  // console.log(exp);
  // const query = `
  // DELETE FROM session WHERE expiration < '${exp}'
  // RETURNING id
  // `;
  const query = `
  DELETE FROM authentication WHERE id > 0
  RETURNING id
  `;

  const tokens = await db.query(query);

  console.log('Old tokens deleted from authentication table..', tokens.rows);
};

module.exports = () => {
  console.log('Running cron schedule to purge old tokens...');
  cron.schedule('0 */3 * * *', () => {
    deleteSessions();
  });
};
