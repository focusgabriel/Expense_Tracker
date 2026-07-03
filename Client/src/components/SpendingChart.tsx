/** @format */

import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS, type Transaction } from "../constants";
import AllTrans from "./AllTrans";

const SpendingChart = () => {
  const [allTrans, setAllTrans] = useState<Transaction[]>([]);

  const getTrans = async () => {
    try {
      fetch("http://localhost:3000/api/v1/getTransaction")
        .then(res => res.json())
        .then(data => setAllTrans(data));
    } catch (error) {
      console.log(error);
    }
  };

  const grouped = allTrans
    .filter(item => item.type === "expense")
    .reduce<Record<string, number>>((acc, trans) => {
      const { category, amount } = trans;

      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

  const totalIncome = allTrans
    .filter(item => item.type === "income")
    .reduce((value, sum) => value + sum.amount, 0);

  const chartData = Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
    fill: CATEGORY_COLORS[category] ?? "gray",
    percentage: (amount / totalIncome) * 100,
  }));

  const totalExpense = chartData.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    getTrans();
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <div className="flex w-full flex-col gap-5 lg:h-[340px] lg:flex-row lg:items-stretch lg:justify-between lg:overflow-hidden">
        <div className="relative h-72 w-full lg:h-full lg:w-[34%]">
          <h2 className="p-2 font-bold text-slate-900">Spending Overview</h2>
          <div className="relative h-[calc(100%-2rem)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius="50%"
                  outerRadius="75%"
                  paddingAngle={3}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Total expense
              </span>
              <span className="mt-1 text-xl font-semibold text-slate-900">
                &#8358;{totalExpense.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid w-full content-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 lg:w-[30%]">
          {chartData.map(item => (
            <div
              key={item.category}
              className="grid grid-cols-[0.75rem_minmax(0,1fr)_auto_auto] items-center gap-3"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <div className="truncate text-sm font-medium text-slate-900">
                {item.category}
              </div>
              <div className="whitespace-nowrap text-sm text-gray-500">
                &#8358;{item.amount.toLocaleString()}
              </div>
              <div className="whitespace-nowrap text-sm font-medium text-slate-700">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        <AllTrans />
      </div>
    </div>
  );
};

export default SpendingChart;
