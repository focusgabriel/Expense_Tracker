/** @format */

import TranscCard from "../components/TranscCard";
import type { DashboardSummary } from "../types/dashboard";

interface AllTransProps {
  summary: DashboardSummary;
}

const AllTransaction = ({ summary }: AllTransProps) => {

  return (
    <div className="sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:p-4 sm:shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        {/* <span className="text-green-600">{prevMonth}</span> */}
        <TranscCard
          title="Total Balance"
          amount={summary.netBalance.toLocaleString()}
          content={
            summary.monthlyBalance !== null || summary.previousMonthIncome !== null ? (
              <span>
                vs last month{" "}
                <span
                  className={`${summary.monthlyBalance >= summary.previousMonthIncome ? "text-red-500 font-bold" : "text-indigo-600 font-bold"}`}
                >
                  &#8358;{summary.previousMonthIncome.toLocaleString()}
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
          amount={summary.totalIncome.toLocaleString()}
          content="diverse or single source"
          icon="/dollar.png"
          alternate="dollar"
        />

        <TranscCard
          title="Monthly Expense"
          amount={summary.totalExpense.toLocaleString()}
          content="monthly expense roundup"
          icon="/expense.png"
          alternate="expense"
        />

        <TranscCard
          title="Net Balance"
          amount={summary.netBalance.toLocaleString()}
          content="available balance"
          icon="/bal.png"
          alternate="balance"
        />
      </div>
    </div>
  );
};

export default AllTransaction;
