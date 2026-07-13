/** @format */

import { useEffect, useState } from "react";
import TranscCard from "../components/TranscCard";
// import TranscCard from "./TranscCard";

const AllTransaction = () => {
  // const [incomeTrans, setIncomeTrans] = useState(null);
  // const [expenseTrans, setExpenseTrans]= useState(null);
  const [netBalanceTrans, setNetBalanceTrans]= useState(null);

  const [monthlyExpense, setMonthlyExpense] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState(null);
  const [monthlyBalance, setMonthlyBalance] = useState(null);
  const [prevMonth, setPrevMonth] = useState(null);

  useEffect(() => {
    try {
      fetch("http://localhost:3000/api/v1/getMonthlyIncome")
        .then(res => res.json())
        .then(data => {
          setMonthlyIncome(data.get_income.toLocaleString());
          setMonthlyExpense(data.get_expense.toLocaleString());
          setMonthlyBalance(data.netbalance.toLocaleString());
          setPrevMonth(data.lastMonthNetBalance.toLocaleString());
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  //  fetching the totalTransaction endpoint for total income, total expense and net balance from the backend
 
  useEffect(() => {
    try {
      fetch("http://localhost:3000/api/v1/totalTransaction")
        .then(res => res.json())
        .then(data => {
          // setIncomeTrans(data.Total_income.toLocaleString());
          // setExpenseTrans(data.Total_expense.toLocaleString());
          setNetBalanceTrans(data.NetBalance.toLocaleString());
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4 ">
        {/* <span className="text-green-600">{prevMonth}</span> */}
        <TranscCard
          title="Total Balance"
          amount={netBalanceTrans}
          content={
            monthlyBalance !== null || prevMonth !== null ?
            <span>
              vs last month{" "}
              <span
                className={`${monthlyBalance >= prevMonth ? "text-red-500 font-bold" : "text-green-500 font-bold"}`}
              >
                &#8358;{prevMonth}
              </span>{" "}
            </span> : ""
          }
          icon="/wallet.png"
          alternate="wallet"
        />

        <TranscCard
          title="Monthly Income"
          amount={monthlyIncome}
          content="from one source"
          icon="/wallet.png"
          alternate="wallet"
        />

        <TranscCard
          title="Monthly Expense"
          amount={monthlyExpense}
          content="monthly expense roundup"
          icon="/expense.png"
          alternate="expense"
        />

        <TranscCard
          title="Net Balance"
          amount={monthlyBalance}
          content="available balance"
          icon="/bal.png"
          alternate="balance"
        />
      </div>
    </div>
  );
};

export default AllTransaction;
