import React from "react";
import { Progress } from "antd";

const Analytics = ({ allTransaction }) => {
  // Check if allTransaction is defined and not empty
  if (!allTransaction || allTransaction.length === 0) {
    return <div>No transactions available.</div>;
  }

  // Calculate totals
  const totalTransaction = allTransaction.length;
  const totalIncomeTransactions = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );

  // Calculate percentages for transaction counts
  const totalIncomePercent =
    totalTransaction > 0
      ? ((totalIncomeTransactions.length / totalTransaction) * 100).toFixed(2)
      : 0;
  const totalExpensePercent =
    totalTransaction > 0
      ? ((totalExpenseTransactions.length / totalTransaction) * 100).toFixed(2)
      : 0;

  // Calculate turnover totals
  const totalTurnover = allTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = allTransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpenseTurnover = allTransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // Calculate percentages for turnover
  const totalIncomeTurnoverPercent =
    totalTurnover > 0
      ? ((totalIncomeTurnover / totalTurnover) * 100).toFixed(2)
      : 0;
  const totalExpenseTurnoverPercent =
    totalTurnover > 0
      ? ((totalExpenseTurnover / totalTurnover) * 100).toFixed(2)
      : 0;

  return (
    <div className="row m-3">
      {/* Card 1: Transaction Counts */}
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h4>Total Transactions: {totalTransaction}</h4>
          </div>
          <div className="card-body">
            <h5 className="text-success">Income: {totalIncomeTransactions.length}</h5>
            <h5 className="text-danger">Expense: {totalExpenseTransactions.length}</h5>
            <hr />
            <h6>Income Percentage: {totalIncomePercent}%</h6>
            <h6>Expense Percentage: {totalExpensePercent}%</h6>

            {/* Progress Bars */}
            <div className="d-flex justify-content-around mt-3">
              <Progress
                type="circle"
                strokeColor="green"
                percent={parseFloat(totalIncomePercent)}
                format={() => `${totalIncomePercent}%`}
              />
              <Progress
                type="circle"
                strokeColor="red"
                percent={parseFloat(totalExpensePercent)}
                format={() => `${totalExpensePercent}%`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Turnover */}
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h4>Total Turnover: {totalTurnover}</h4>
          </div>
          <div className="card-body">
            <h5 className="text-success">Income Turnover: {totalIncomeTurnover}</h5>
            <h5 className="text-danger">Expense Turnover: {totalExpenseTurnover}</h5>
            <hr />
            <h6>Income Turnover Percentage: {totalIncomeTurnoverPercent}%</h6>
            <h6>Expense Turnover Percentage: {totalExpenseTurnoverPercent}%</h6>

            {/* Progress Bars */}
            <div className="d-flex justify-content-around mt-3">
              <Progress
                type="circle"
                strokeColor="green"
                percent={parseFloat(totalIncomeTurnoverPercent)}
                format={() => `${totalIncomeTurnoverPercent}%`}
              />
              <Progress
                type="circle"
                strokeColor="red"
                percent={parseFloat(totalExpenseTurnoverPercent)}
                format={() => `${totalExpenseTurnoverPercent}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;