const db = require("../models/db");

const investorController = {};

// Get Investors Controller
investorController.getInvestors = async (req, res, next) => {
  try {
    const query = `
    SELECT *
    FROM investor
    `;

    const investors = await db.query(query);

    res.locals.investors = investors.rows;

    return next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = investorController;
