/** @format */

import { useEffect, useState } from "react";
import TranscCard from "../components/TranscCard";
import refreshClient from "../api/fetch";
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
      refreshClient.get("/getMonthlyIncome")
        .then(response => {
          setMonthlyIncome(response.data.get_income.toLocaleString());
          setMonthlyExpense(response.data.get_expense.toLocaleString());
          setMonthlyBalance(response.data.netbalance.toLocaleString());
          setPrevMonth(response.data.lastMonthNetBalance.toLocaleString());
        }).catch(error => console.log(error))
    } catch (error) {
      console.error(error);
    }
  }, []);

  //  fetching the totalTransaction endpoint for total income, total expense and net balance from the backend
 
  useEffect(() => {
    try {
      refreshClient.get("/totalTransaction")
        .then(res => {
          // setIncomeTrans(data.Total_income.toLocaleString());
          // setExpenseTrans(data.Total_expense.toLocaleString());
          setNetBalanceTrans(res.data.NetBalance.toLocaleString());
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="sm:rounded-2xl sm:border sm:border-emerald-100 sm:bg-white/90 sm:p-4 sm:shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
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
