/** @format */

import { useEffect, useRef, useState } from "react";
import Card from "./Card";
// import type { Transaction } from "../constants"

type Transaction = {
  type: "income" | "expense" | string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_date: string;
};

const AddTask = () => {
  const [transaction, setTransaction] = useState<Transaction>(null);

  const [allTrans, setAllTrans] = useState<Transaction[]>([]);
  const Type = useRef<HTMLSelectElement>(null);
  const Amount = useRef<HTMLInputElement>(null);
  const Category = useRef<HTMLInputElement>(null);
  const Description = useRef<HTMLInputElement>(null);
  const newDate = useRef<HTMLInputElement>(null);
  const Current_date = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    const newTransaction = {
      type: Type.current.value.toLowerCase(),
      amount: Number(Amount.current.value.toLowerCase()),
      category: Category.current.value.toLowerCase(),
      description: Description.current.value.toLowerCase(),
      date: String(Current_date.current.value),
      created_date: String(Current_date.current.value),
    };

    setTransaction(newTransaction);
  };

  // console.log(transaction)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/addTransaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transaction),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error sending data");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // const getTrans = async () => {
  //   try {
  //     fetch("http://localhost:3000/api/v1/getTransaction")
  //       .then(res => res.json())
  //       .then(data => setAllTrans(data));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getTrans();
  // }, []);

  // import { ExpenseAnalytics } from './components/ExpenseChart';

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-200 bg-white/90 p-6 sm:p-8">
      <div className="mb-6 rounded-3xl bg-emerald-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-emerald-900">
          Add a Transaction
        </h2>
        <p className="mt-2 text-sm text-emerald-700">
          Track your income and expenses with a clean green-themed form.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-7 rounded-3xl bg-white p-6 sm:grid-cols-2 sm:p-8"
      >
        <div className="flex flex-col gap-4">
          <label
            htmlFor="Type"
            className="text-sm font-semibold text-emerald-700"
          >
            Type
          </label>
          <select
            name="type"
            ref={Type}
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          >
            <option value="income">INCOME</option>
            <option value="expense">EXPENSE</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <label
            htmlFor="amount"
            className="text-sm font-semibold text-emerald-700"
          >
            Amount
          </label>
          <input
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            type="number"
            placeholder="enter your amount"
            min={3}
            ref={Amount}
            name="amount"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label
            htmlFor="Category"
            className="text-sm font-semibold text-emerald-700"
          >
            Category
          </label>
          <input
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            type="text"
            placeholder="enter the category of your transaction"
            ref={Category}
            name="category"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-emerald-700"
          >
            Description
          </label>
          <input
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            type="text"
            placeholder="enter the description of your transaction"
            minLength={7}
            ref={Description}
            name="description"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label
            htmlFor="date"
            className="text-sm font-semibold text-emerald-700"
          >
            Date
          </label>
          <input
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            type="date"
            ref={newDate}
            name="date"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label
            htmlFor="date"
            className="text-sm font-semibold text-emerald-700"
          >
            CreatedAt
          </label>
          <input
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            type="date"
            ref={Current_date}
            name="current_date"
          />
        </div>

        <button
          type="submit"
          onClick={handleClick}
          className="col-span-full rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Save Transaction
        </button>
      </form>

      <div className="mt-8 grid gap-4">
        {allTrans.map((item, index) => (
          <Card
            key={index}
            type={item.type}
            amount={item.amount}
            category={item.category}
            description={item.description}
            date={item.date}
            created_date={item.created_date}
          />
        ))}
      </div>

      {/* <h1>Total Income</h1>
      <p>{incomeTrans}</p>

      <h1>Expense Income</h1>
      <p>{expenseTrans}</p>

      <h1>Net Balance</h1>
      <p>{netBalanceTrans}</p> */}
    </div>
  );
};

export default AddTask;
