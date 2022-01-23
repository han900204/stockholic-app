const express = require("express");
const router = express.Router();
const { getInvestors } = require("../controllers/investorController");

/**
 * Investor REST API
 */

// Get Investors
router.get("/", getInvestors, (req, res) => {
  console.log(res.locals.investors);
  return res.status(200).json({ investors: res.locals.investors });
});

module.exports = router;
