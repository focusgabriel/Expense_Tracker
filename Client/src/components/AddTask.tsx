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
  const [allTrans, setAllTrans] = useState<Transaction[]>([]);
  const Type = useRef<HTMLSelectElement>(null);
  const Amount = useRef<HTMLInputElement>(null);
  const Category = useRef<HTMLInputElement>(null);
  const Description = useRef<HTMLInputElement>(null);
  const newDate = useRef<HTMLInputElement>(null);
  const Current_date = useRef<HTMLInputElement>(null);

  const getTrans = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/getTransaction");

      if (!response.ok) {
        throw new Error("Error loading transactions");
      }

      const data = await response.json();
      setAllTrans(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTransaction = {
      type: Type.current?.value.toLowerCase() ?? "",
      amount: Number(Amount.current?.value ?? 0),
      category: Category.current?.value.toLowerCase() ?? "",
      description: Description.current?.value.toLowerCase() ?? "",
      date: newDate.current?.value ?? "",
      created_date: Current_date.current?.value ?? "",
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/addTransaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error sending data");
      }
      console.log(data);
      await getTrans();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrans();
  }, []);

  const fieldClass =
    "min-h-14 w-full rounded-xl border border-emerald-200 bg-white px-5 py-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
  const labelClass = "text-sm font-semibold text-slate-700";

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
          <label htmlFor="type" className={labelClass}>
            Type
          </label>
          <select
            id="type"
            name="type"
            ref={Type}
            className={fieldClass}
          >
            <option value="income">INCOME</option>
            <option value="expense">EXPENSE</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="amount" className={labelClass}>
            Amount
          </label>
          <input
            id="amount"
            className={fieldClass}
            type="number"
            placeholder="Enter your amount"
            min={0}
            onWheel={event => event.currentTarget.blur()}
            ref={Amount}
            name="amount"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <input
            id="category"
            className={fieldClass}
            type="text"
            placeholder="Enter the category"
            ref={Category}
            name="category"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <input
            id="description"
            className={fieldClass}
            type="text"
            placeholder="Enter the description"
            minLength={7}
            ref={Description}
            name="description"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            className={fieldClass}
            type="date"
            ref={newDate}
            name="date"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="current_date" className={labelClass}>
            CreatedAt
          </label>
          <input
            id="current_date"
            className={fieldClass}
            type="date"
            ref={Current_date}
            name="current_date"
          />
        </div>

        <button
          type="submit"
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
