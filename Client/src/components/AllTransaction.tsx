import { useEffect, useRef, useState } from "react"
import TranscCard from "./TranscCard";

const AllTransaction = () => {

const [incomeTrans, setIncomeTrans]= useState(null);
const [expenseTrans, setExpenseTrans]= useState(null);
const [netBalanceTrans, setNetBalanceTrans]= useState(null);

const incomeTransaction = async() => {
    try{
        fetch("http://localhost:3000/api/v1/totalTransaction")
        .then(res => res.json())
        .then(data => setIncomeTrans(data.Total_income))
    } catch(error) {
      console.log(error);
    }
  }

  const expenseTransaction = async() => {
    try{
        fetch("http://localhost:3000/api/v1/totalTransaction")
        .then(res => res.json())
        .then(data => setExpenseTrans(data.Total_expense))
    } catch(error) {
      console.log(error);
    }
  }

  const netBalanceTransaction = async() => {
    try{
        fetch("http://localhost:3000/api/v1/totalTransaction")
        .then(res => res.json())
        .then(data => setNetBalanceTrans(data.NetBalance))
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    incomeTransaction()
    expenseTransaction()
    netBalanceTransaction()
  }, [])


  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
      <TranscCard title="Total Income" amount={incomeTrans} content="from one source" icon="/wallet.png" alternate="wallet" />
      <TranscCard title="Total Expense" amount={expenseTrans} content="monthly expense roundup" icon="/expense.png" alternate="expense"  />
      <TranscCard title="Net Balance" amount={netBalanceTrans} content="available balance" icon="/bal.png" alternate="balance" />
      </div>
    </div>
  )
}

export default AllTransaction
