/** @format */

import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS, type Transaction } from "../constants";
import AllTrans from "./AllTrans";

const SpendingChart = () => {
  const [allExpense, setAllExpense] = useState<Transaction[]>([]);
  const [allIncome, setAllIncome] = useState(null);

  // getting the monthly expense and income to use it to set the pie chart, particularly the expense variable 
  const getTrans = async () => {
    const token = localStorage.getItem("token");
    try {
      fetch("http://localhost:3000/api/v1/getMonthlyIncome", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {setAllExpense(data.getMonthlyExpense); setAllIncome(data.get_income)});
    } catch (error) {
      console.log(error);
    }
  };

  //  filtering out the expense type and summing the category amounts specifically to get there percentages so as to represent them graphically on the pie chart.
  const grouped = allExpense
    .filter(item => item.type === "expense")
    .reduce<Record<string, number>>((acc, trans) => {
      const { category, amount } = trans;

      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

  // getting the total income so that the total amount by the category would be divided by the toal income and multiply by 100 to get the percentage of each category
  const totalIncome = allIncome

  const chartData = Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
    // here i added a fill object to hold the colors that would be used for categorical representation meaning if it is shopping the color orange would be used to represent it on the pie chart. because our pie chart would be of many colors to make visually beatiful
    fill: CATEGORY_COLORS[category] ?? "gray",

    // i also added a percentage object so that i can add the calculated percentage to the array, meaning that every percentage based on the category would be referneced directly just like category and amount, directly from the array. 
    percentage: (amount / totalIncome) * 100,
  }));

  // the total expense recorded or gotten from the chartData since we are only dealing with the expense in chartData now i am summing it up the whole expense gotten from each category into one variable.
  const totalExpense = chartData.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    getTrans();
  }, []);

  return (
    <div className="sm:rounded-2xl sm:border sm:border-emerald-100 sm:bg-white/90 sm:p-4 sm:shadow-sm">
      <div className="flex w-full flex-col gap-5 lg:h-85 lg:flex-row lg:items-stretch lg:justify-between lg:overflow-hidden">
        <div className="relative h-72 w-full lg:h-full lg:w-[34%]">
          <h2 className="p-2 font-bold text-slate-900">Spending Overview</h2>
          <div className="relative h-[calc(100%-2rem)]">
            {/* the pie chart gotten from rechartjs for the analytical analysis of the expenses */}
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
              <div className="whitespace-nowrap text-sm text-gray-500 sm:absolute sm:right-[30%]">
                &#8358;{item.amount.toLocaleString()}
              </div>
              <div className="whitespace-nowrap text-sm font-medium text-slate-700">
                {/* now this is where i used the percentage that was externally added to the array. now each item now has a percentage of the specified category making it more understandable on what is going on */}
                {item.percentage.toFixed(2)}%
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
