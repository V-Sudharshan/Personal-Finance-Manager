import React, { useEffect, useState } from "react";
import { getTransactions } from "../api";

const TransactionList = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions(userId).then((res) => setTransactions(res.data));
  }, [userId]);

  return (
    <div>
      <h3>Your Transactions</h3>
      <ul>
        {transactions.map((t) => (
          <li key={t._id}>
            {t.date} - {t.category} - {t.type}: ₹{t.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
