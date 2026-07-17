/** @format */

import { useEffect, useState } from "react";
import CardReview from "./CardReview";
import refreshClient from "../api/fetch";

const MonthReview = () => {
  const [reviewIncome, setReviewIncome] = useState<number | null>(null);
  const [reviewExpense, setReviewExpense] = useState<number | null>(null);
  const [reviewBalance, setReviewBalance] = useState<number | null>(null);

  const [formattedIncome, setFormattedIncome] = useState<string | null>(null);
  const [formattedExpense, setFormattedExpense] = useState<string | null>(null);
  const [formattedBalance, setFormattedBalance] = useState<string | null>(null);

  const [getDate, setGetDate] = useState<any>();
  const formatDate = dateValue => {
    const newDate = new Date(dateValue);
    return newDate.toLocaleDateString("en-us", {
      month: "long",
      year: "numeric",
    });
  };
  
  useEffect(() => {
    try {
      refreshClient.get("http://localhost:3000/api/v1/getMonthlyIncome")
        .then(res => {
          setReviewIncome(res.data.get_income);
          setReviewExpense(res.data.get_expense);
          setReviewBalance(res.data.netbalance);

          setFormattedIncome(res.data.get_income.toLocaleString());
          setFormattedExpense(res.data.get_expense.toLocaleString());
          setFormattedBalance(res.data.netbalance.toLocaleString());

          setGetDate(res.data.endOfLastMonth);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(reviewExpense);
  const balancePercentage =
    reviewIncome && reviewIncome !== 0 && reviewBalance != null
      ? Number(((reviewBalance / reviewIncome) * 100).toFixed(2))
      : null;

  return (
    <div className="w-full">
      <div className="sm:rounded-xl sm:border sm:border-green-200 sm:bg-white sm:p-6 sm:shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Monthly Summary</h1>
            <p className="text-sm font-medium text-slate-600">
              {formatDate(getDate)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardReview title="Income" content={<span>{formattedIncome}</span>} />
          <CardReview
            title="Expense"
            content={<span>{formattedExpense}</span>}
          />
          <CardReview
            title="Net Balance"
            content={<span>{formattedBalance}</span>}
          />
          {/* <CardReview
            title="Balance rate"
            content={
              <span >
                {balancePercentage ?? 0}
                <span>%</span>
              </span>
            }
          /> */}
          <div>
            <p className="text-sm">BALANCE RATE</p>
            <p className="font-bold">{balancePercentage ?? 0}<span>%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthReview;
