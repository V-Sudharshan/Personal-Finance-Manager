import React from "react";
import { Progress, Card } from "antd";

const Analytics = ({ allTransaction }) => {
  // Check if allTransaction is defined and not empty
  if (!allTransaction || allTransaction.length === 0) {
    return <div>No transactions available.</div>;
  }

  // Define categories
  const categories = [
    "salary",
    "tip",
    "food",
    "movie",
    "bills",
    "fee",
    "medical",
    "tax",
    "mobile recharge",
  ];

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

  // Calculate category-wise income
  const categoryIncome = categories.map((category) => {
    const amount = allTransaction
      .filter(
        (transaction) =>
          transaction.type === "income" && transaction.category === category
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      category,
      amount,
      percent: totalIncomeTurnover > 0 ? ((amount / totalIncomeTurnover) * 100).toFixed(2) : 0,
    };
  });

  // Calculate category-wise expense
  const categoryExpense = categories.map((category) => {
    const amount = allTransaction
      .filter(
        (transaction) =>
          transaction.type === "expense" && transaction.category === category
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      category,
      amount,
      percent: totalExpenseTurnover > 0 ? ((amount / totalExpenseTurnover) * 100).toFixed(2) : 0,
    };
  });

  return (
    <div className="row m-3">
      {/* Card 1: Transaction Counts */}
      <div className="col-md-4">
        <Card
          title="Transaction Counts"
          style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }} // Light gray border with subtle shadow
        >
          <h4>Total Transactions: {totalTransaction}</h4>
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
        </Card>
      </div>

      {/* Card 2: Turnover */}
      <div className="col-md-4">
        <Card
          title="Turnover"
          style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }} // Light gray border with subtle shadow
        >
          <h4>Total Turnover: {totalTurnover}</h4>
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
        </Card>
      </div>

      {/* Card 3: Category-wise Income */}
      <div className="col-md-4">
        <Card
          title="Category-wise Income"
          style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }} // Light gray border with subtle shadow
        >
          <h4>Income by Category</h4>
          {categoryIncome.map(
            ({ category, amount, percent }) =>
              amount > 0 && (
                <div key={category} className="mb-3">
                  <h5>{category}</h5>
                  <Progress
                    percent={parseFloat(percent)}
                    status="active"
                    strokeColor="#52c41a"
                  />
                  <p>Amount: {amount}</p>
                </div>
              )
          )}
        </Card>
      </div>

      {/* Card 4: Category-wise Expense */}
      <div className="col-md-4 mt-4">
        <Card
          title="Category-wise Expense"
          style={{ border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }} // Light gray border with subtle shadow
        >
          <h4>Expense by Category</h4>
          {categoryExpense.map(
            ({ category, amount, percent }) =>
              amount > 0 && (
                <div key={category} className="mb-3">
                  <h5>{category}</h5>
                  <Progress
                    percent={parseFloat(percent)}
                    status="active"
                    strokeColor="#ff4d4f"
                  />
                  <p>Amount: {amount}</p>
                </div>
              )
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;