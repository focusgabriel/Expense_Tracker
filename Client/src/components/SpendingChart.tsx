/** @format */

import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS, type Transaction } from "../constants";

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

  // const categories = chartData.map((item) => ({
  //   ...item,

  //   percentage: (item.amount / totalIncome) * 100
  // }))
  useEffect(() => {
    getTrans();
  }, []);

  return (
    <div className="w-full" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            // label={({value}) => `${value}`}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {chartData.map(item => (
          <div key={item.category} className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: item.fill }}
            />
            <div>
              <div className="font-medium text-sm">{item.category}</div>
              <div className="text-xs text-gray-500">₦{item.amount}</div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="h-3 w-full rounded-full bg-gray-200"></div> */}
      {chartData.map(item => (
        <div className="h-3 w-full rounded-full mt-2">
          <div
            className="h-full rounded-full"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.fill,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SpendingChart;
