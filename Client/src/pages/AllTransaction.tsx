/** @format */

import { ArrowDown, ArrowUp } from "lucide-react";
import TranscCard from "../components/TranscCard";
import type { DashboardSummary } from "../types/dashboard";

interface AllTransProps {
  summary: DashboardSummary;
}

const AllTransaction = ({ summary }: AllTransProps) => {
  const incomeTrendUp = summary.monthlyIncome >= summary.previousMonthIncome;
  const expenseTrendDown =
    summary.monthlyExpense <= summary.previousMonthExpense;
  const balanceTrendUp = summary.monthlyBalance >= summary.previousMonthBalance;

  return (
    <div className="sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:p-4 sm:shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        <TranscCard
          title="Net Savings"
          amount={summary.previousMonthBalance.toLocaleString()}
          content={
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold sm:text-sm ${balanceTrendUp ? "text-emerald-600" : "text-red-500"}`}
            >
              {balanceTrendUp ? (
                <ArrowUp size={14} className="shrink-0" />
              ) : (
                <ArrowDown size={14} className="shrink-0" />
              )}
              <span>vs last month</span>
            </span>
          }
          icon="/wallet.png"
          alternate="wallet"
        />

        <TranscCard
          title="Monthly Income"
          amount={summary.monthlyIncome.toLocaleString()}
          content={
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold sm:text-sm ${incomeTrendUp ? "text-emerald-600" : "text-red-500"}`}
            >
              {incomeTrendUp ? (
                <ArrowUp size={14} className="shrink-0" />
              ) : (
                <ArrowDown size={14} className="shrink-0" />
              )}
              <span>vs last month</span>
            </span>
          }
          icon="/dollar.png"
          alternate="dollar"
        />

        <TranscCard
          title="Monthly Expense"
          amount={summary.monthlyExpense.toLocaleString()}
          content={
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold sm:text-sm ${expenseTrendDown ? "text-emerald-600" : "text-red-500"}`}
            >
              {expenseTrendDown ? (
                <ArrowDown size={14} className="shrink-0" />
              ) : (
                <ArrowUp size={14} className="shrink-0" />
              )}
              <span>vs last month</span>
            </span>
          }
          icon="/expense.png"
          alternate="expense"
        />

        <TranscCard
          title="Monthly Balance"
          amount={summary.monthlyBalance.toLocaleString()}
          content={
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold sm:text-sm ${balanceTrendUp ? "text-emerald-600" : "text-red-500"}`}
            >
              {balanceTrendUp ? (
                <ArrowUp size={14} className="shrink-0" />
              ) : (
                <ArrowDown size={14} className="shrink-0" />
              )}
              <span>current month</span>
            </span>
          }
          icon="/bal.png"
          alternate="balance"
        />
      </div>
    </div>
  );
};

export default AllTransaction;
