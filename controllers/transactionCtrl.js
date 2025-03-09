const Transaction = require("../models/Transaction");
const moment = require("moment");

// ✅ Fetch all transactions for a user
// ✅ Fetch all transactions for a user
// ✅ Fetch all transactions for a user
const getAllTransaction = async (req, res) => {
  try {
    const { frequency, userid, selectedDate, type } = req.body;

    if (!userid) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    let filter = { userid };

    if (type && type !== "all") {
      filter.type = type;
    }

    // ✅ Fix: Ensure correct date parsing
    if (frequency === "custom" && Array.isArray(selectedDate) && selectedDate.length === 2) {
      const startDate = new Date(selectedDate[0]); 
      const endDate = new Date(selectedDate[1]);

      // Adjust to include the full last day
      endDate.setHours(23, 59, 59, 999);

      if (!isNaN(startDate) && !isNaN(endDate)) {
        filter.date = { $gte: startDate, $lte: endDate };
      } else {
        console.error("Invalid date format received:", selectedDate);
      }
    } else if (frequency !== "custom" && frequency !== "all") {
      filter.date = {
        $gte: moment().subtract(Number(frequency), "days").startOf("day").toDate(),
      };
    }

    console.log("Final Filter:", filter);

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // ✅ Fix: Convert stored MongoDB dates to UTC string for debugging
    console.log("Fetched Transactions:", transactions.map(tx => ({
      date: tx.date.toISOString(),
      amount: tx.amount
    })));

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

// ✅ Edit a transaction
const editTransaction = async (req, res) => {
  try {
    const { transactionId, ...updatedFields } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: "Transaction ID is required" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      updatedFields,
      { new: true } // Return the updated transaction
    );

    if (!updatedTransaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction Updated Successfully", transaction: updatedTransaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: "Transaction ID is required" });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    if (!deletedTransaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllTransaction, addTransaction, editTransaction, deleteTransaction };