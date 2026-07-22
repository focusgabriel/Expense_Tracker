/** @format */

// import { useEffect, useState } from "react";
import TranscCard from "../components/TranscCard";
// import refreshClient from "../api/fetch";
import type { DashboardSummary } from "../types/dashboard";
// import TranscCard from "./TranscCard";

interface AllTransProps {
  summary: DashboardSummary;
}

const AllTransaction = ({ summary }: AllTransProps) => {

  console.log("this is a netbalance:", summary.totalExpense)
  return (
    <div className="sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:p-4 sm:shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        {/* <span className="text-green-600">{prevMonth}</span> */}
        <TranscCard
          title="Total Balance"
          amount={summary.netBalance}
          content={
            summary.monthlyBalance !== null || summary.previousMonthBalance !== null ? (
              <span>
                vs last month{" "}
                <span
                  className={`${summary.monthlyBalance >= summary.previousMonthBalance ? "text-red-500 font-bold" : "text-indigo-600 font-bold"}`}
                >
                  &#8358;{summary.previousMonthBalance}
                </span>{" "}
              </span>
            ) : (
              ""
            )
          }
          icon="/wallet.png"
          alternate="wallet"
        />

        <TranscCard
          title="Monthly Income"
          amount={summary.totalIncome}
          content="from one source"
          icon="/wallet.png"
          alternate="wallet"
        />

        <TranscCard
          title="Monthly Expense"
          amount={summary.totalExpense}
          content="monthly expense roundup"
          icon="/expense.png"
          alternate="expense"
        />

        <TranscCard
          title="Net Balance"
          amount={summary.netBalance}
          content="available balance"
          icon="/bal.png"
          alternate="balance"
        />
      </div>
    </div>
  );
};

export default AllTransaction;
