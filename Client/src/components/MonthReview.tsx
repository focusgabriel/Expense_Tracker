/** @format */

import { useEffect, useState } from "react";
import CardReview from "./CardReview";
import type { Transaction } from "../constants";

const MonthReview = () => {
  const [reviewIncome, setReviewIncome] = useState(null);
  const [reviewExpense, setReviewExpense] = useState(null);
  const [reviewBalance, setReviewBalance] = useState(null);
  const [getDate, setGetDate] = useState();
  const formatDate = dateValue => {
    const newDate = new Date(dateValue)
    return newDate.toLocaleDateString("en-us", {
      month:"long",
      year:"numeric",
      // day: "numeric"
    })
    // return newDate;
  }
  useEffect(() => {
    try {
      fetch("http://localhost:3000/api/v1/getMonthlyIncome")
        .then(res => res.json())
        .then(data => {
          setReviewIncome(data.get_income.toLocaleString());
          setReviewExpense(data.get_expense.toLocaleString());
          setReviewBalance(data.netbalance.toLocaleString());
          setGetDate(data.endOfLastMonth);
        });
        // console.log(rev)
    } catch (error) {
      console.log(error);
    }
  }, []);

  
  return <div>
    <div className="flex justify-between border border-green-200 rounded-xl p-6">
      <div className="flex-col">
        <h1 className="text-2xl font-bold">Monthly Summary</h1>
        <p className="text-sm font-medium">{formatDate(getDate)}</p>
      </div>
      <CardReview title="income" content={reviewIncome} />
      <CardReview title="expense" content={reviewExpense} />
      <CardReview title="net balance" content={reviewBalance} />
    </div>
  </div>;
};

export default MonthReview;
