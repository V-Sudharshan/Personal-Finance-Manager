const Transaction = require("../models/Transaction");
const moment = require("moment");

// ✅ Fetch all transactions for a user
const getAllTransaction = async (req, res) => {
  try {
    const { frequency, userid, selectedDate, type } = req.body;

    if (!userid) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    let filter = { userid };

    // ✅ Apply type filter (income, expense, or all)
    if (type && type !== "all") {
      filter.type = type;
    }

    // ✅ Apply date filters
    if (frequency === "custom" && selectedDate?.length === 2) {
      filter.date = {
        $gte: new Date(selectedDate[0]), // Start date
        $lte: new Date(selectedDate[1]), // End date
      };
    } else if (frequency !== "custom") {
      filter.date = {
        $gte: moment().subtract(Number(frequency), "days").toDate(),
      };
    }

    console.log("Fetching transactions with filter:", filter);

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { userid, amount, type, category, date, reference, description } = req.body;

    if (!userid || !amount || !type || !category || !date) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newTransaction = new Transaction({
      userid,
      amount,
      type,
      category,
      date: new Date(date),
      reference,
      description,
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json({ success: true, message: "Transaction Created Successfully", transaction: savedTransaction });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllTransaction, addTransaction };
