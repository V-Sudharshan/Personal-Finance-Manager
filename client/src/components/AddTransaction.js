import React, { useState } from "react";
import { addTransaction } from "../api";

const AddTransaction = ({ userId }) => {
  const [form, setForm] = useState({ amount: "", category: "", type: "expense" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction({ ...form, userId });
    alert("Transaction Added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="Amount" onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      <input type="text" placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTransaction;
