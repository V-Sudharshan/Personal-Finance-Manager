const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userid:{type:String,required:true,},
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  reference: { type: String },
  type: { type: String, enum: ["income", "expense"], required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
