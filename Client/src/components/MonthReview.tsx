/** @format */

import CardReview from "./CardReview";

type MonthReviewProps = {
  get_income: number;
  get_expense: number;
  monthlyBalance: number;
  endOfLastMonth: string;
};

const MonthReview = ({
  get_income,
  get_expense,
  monthlyBalance,
  endOfLastMonth,
}: MonthReviewProps) => {
  const formatDate = (dateValue: string) => {
    const newDate = new Date(dateValue);
    return newDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const balancePercentage =
    get_income && get_income !== 0 && monthlyBalance != null
      ? Number(((monthlyBalance / get_income) * 100).toFixed(2))
      : null;

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Monthly Summary
            </h1>
            <p className="text-sm font-medium text-slate-500">
              {formatDate(endOfLastMonth)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Current period
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CardReview
            title="Income"
            content={<span>{get_income?.toLocaleString()}</span>}
          />
          <CardReview
            title="Expense"
            content={<span>{get_expense?.toLocaleString()}</span>}
          />
          <CardReview
            title="Net Balance"
            content={<span>{monthlyBalance?.toLocaleString()}</span>}
          />
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              BALANCE RATE
            </p>
            <p className="mt-1 text-xl font-bold text-green-600">
              {balancePercentage ?? 0}
              <span className="text-sm font-medium text-slate-400">%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthReview;