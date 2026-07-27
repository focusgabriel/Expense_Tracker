/** @format */

import { PieChart, Pie, ResponsiveContainer } from "recharts";
import AllTrans from "./AllTrans";


interface spendingProps {
  recentTransactions,
  chartData,
}
const SpendingChart = ({chartData, recentTransactions}: spendingProps) => {
  const hasData = chartData.length > 0;
  const totalExpense = hasData
    ? chartData.reduce(
        (sum:any, item:any) => sum + item.amount,
        0
      )
    : 0;

  const pieData = hasData
    ? chartData
    : [{ category: "No data", amount: 1, fill: "#CBD5E1" }];

  return (
    <div className="sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:p-4 sm:shadow-sm">
      <div className="flex w-full flex-col gap-5 lg:h-85 lg:flex-row lg:items-stretch lg:justify-between lg:overflow-hidden">
        <div className="relative h-72 w-full lg:h-full lg:w-[34%]">
          <h2 className="p-2 font-bold text-slate-900">Spending Overview</h2>
          <div className="relative h-[calc(100%-2rem)]">

            {/* the pie chart gotten from rechartjs for the analytical analysis of the expenses */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius="50%"
                  outerRadius="75%"
                  paddingAngle={hasData ? 2 : 0}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-widest text-slate-500">
                Total expense
              </span>
              <span className="mt-1 text-xl font-semibold text-slate-900">
                &#8358;{totalExpense.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid w-full content-center gap-3 rounded-xl sm:relative bg-slate-50/60 p-4 lg:w-[30%]">
          {hasData ? (
            chartData.map(item => (
              <div
                key={item.category}
                className="grid grid-cols-[0.75rem_minmax(0,1fr)_auto_auto] items-center gap-3"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill ?? "#07023A" }}
                />
                <div className="truncate text-sm font-medium text-slate-900">
                  {item.category}
                </div>
                <div className="whitespace-nowrap text-sm text-gray-500 sm:absolute sm:right-[30%]">
                  &#8358;{item.amount.toLocaleString()}
                </div>
                <div className="whitespace-nowrap text-sm font-medium text-slate-700">
                  {item.percentage.toFixed(2)}%
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-sm text-slate-400">
              No expenses recorded yet
            </div>
          )}
        </div>

        <AllTrans recentTransactions={recentTransactions} />
      </div>
    </div>
  );
}

export default SpendingChart;
