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

  // console.log(acc.amount)
  // console.log(grouped)

  const chartData = Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
    fill: CATEGORY_COLORS[category] ?? "gray",
    percentage: (amount / totalIncome) * 100,
  }));

  const totalExpense = chartData.reduce((sum, item) => sum + item.amount, 0);

  // const categories = chartData.map((item) => ({
  //   ...item,

  //   percentage: (item.amount / totalIncome) * 100
  // }))
  useEffect(() => {
    getTrans();
  }, []);

  return (
    <div>
      <div
        className="w-full flex justify-between gap-5 border border-fuchsia-400 rounded-2xl overflow-hidden m-4"
        style={{ height: 300 }}
      >
        <div className="w-[30%] relative h-full">
          <h2 className="font-bold p-2">Spending Overview</h2>
          <div className="relative h-[calc(100%-2rem)]">
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Total expense
              </span>
              <span className="mt-1 text-xl font-semibold text-slate-900">
                ₦{totalExpense.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="w-[32%] ml-[-8%] grid gap-3rounded-2x p-4 relative">
          {chartData.map(item => (
            <div key={item.category} className="flex items-center gap-3 ">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <div className="flex justify-between w-full gap-4">
                <div className="font-medium text-sm text-slate-900">
                  {item.category}
                </div>
                <div className="text-sm absolute right-14 text-gray-500">
                  ₦{item.amount.toLocaleString()}
                </div>
                <div className="text-sm absolute right-4 text-slate-700">
                  {item.percentage.toFixed(1)}%
                </div>
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
