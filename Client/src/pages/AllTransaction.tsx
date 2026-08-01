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
          title="Net Savings"
          amount={summary.previousMonthBalance.toLocaleString()}
          content="balance of last month"
          icon="/wallet.png"
          alternate="wallet"
        />

        <TranscCard
          title="Monthly Income"
          amount={summary.monthlyIncome.toLocaleString()}
          content={
            summary.monthlyIncome !== null || summary.previousMonthIncome ? (
              <span>
                vs last month{" "}
              <span className={`${summary.monthlyIncome < summary.previousMonthIncome ? "text-green-500 dont-bold" : "text-red-500 font-bold"}`} >
              &#8358;{summary.previousMonthIncome.toLocaleString() ?? 0} 
              </span>{" "} total income <span className="lg:text-2xl text-xl text-green-500">&#8593</span>;
              </span>
            ) : (
              ""
            )
          }
          icon="/dollar.png"
          alternate="dollar"
        />

        <TranscCard
          title="Monthly Expense"
          amount={summary.monthlyExpense.toLocaleString()}
          content="monthly expense roundup"
          icon="/expense.png"
          alternate="expense"
        />

        <TranscCard
          title="Monthly Balance"
          amount={summary.monthlyBalance.toLocaleString()}
          content="this month's available balance"
          icon="/bal.png"
          alternate="balance"
        />
      </div>
    </div>
  );
};

export default AllTransaction;
