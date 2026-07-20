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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Monthly Summary</h1>
            <p className="text-sm font-medium text-slate-500">
              {formatDate(getDate)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Current period
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CardReview title="Income" content={<span>{formattedIncome}</span>} />
          <CardReview
            title="Expense"
            content={<span>{formattedExpense}</span>}
          />
          <CardReview
            title="Net Balance"
            content={<span>{formattedBalance}</span>}
          />
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">BALANCE RATE</p>
            <p className="mt-1 text-xl font-bold text-indigo-600">{balancePercentage ?? 0}<span className="text-sm font-medium text-slate-400">%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthReview;