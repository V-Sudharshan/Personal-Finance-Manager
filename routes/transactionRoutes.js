const express = require("express");
const { addTransaction, getAllTransaction } = require("../controllers/transactionCtrl");

const router = express.Router();

// Add a new transaction
router.post("/add-transaction", addTransaction);

// Fetch all transactions
router.post("/get-transactions", getAllTransaction);

module.exports = router;
