/** @format */

import refreshClient from "../api/fetch";
import { useRef } from "react";
import { EXPENSE_CATEGORIES } from "../constants";
import toast from "react-hot-toast";

const AddBudget = () => {
  const BudgetAmount = useRef<HTMLInputElement>(null);
  const BudgetCategory = useRef<HTMLSelectElement>(null);
  // const menu = "expense";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!BudgetAmount || !BudgetCategory){
      toast.error("field is required", {
        position: "top-center",
        duration: 3000
      })
    }

    const Budget = {
      budgetAmount: Number(BudgetAmount.current?.value.trim()),
      budgetCategory: BudgetCategory.current?.value.toLowerCase().trim(),
    };

    await refreshClient.post("/createBudget", Budget);

    BudgetAmount.current!.value = "";
    BudgetCategory.current!.value = "";
  };

  return (
    <div className="lg:w-[60%] mx-auto">
      <div className="mb-6 rounded-2xl bg-linear-to-br from-indigo-50 to-indigo-100/60 p-6 text-center sm:p-8 ">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl lg:bg-white lg:shadow-sm">
          <svg
            className="h-7 w-7 text-indigo-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16.5" cy="12" r="0.75" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-indigo-900 sm:text-2xl">
          Add Budget
        </h2>
        <p className="mt-1 text-sm text-indigo-600/80">
          create a budget 
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-2xl lg:border lg:border-slate-200 lg:bg-white p-5 lg:shadow-sm sm:grid-cols-2 sm:p-7"
        action="/success"
      >
        <div className="mx-auto">
          <label htmlFor="BudgetAmount">Amount</label>
          <input
            type="number"
            ref={BudgetAmount}
            id="budgetAmount"
            placeholder="enter a value"
            min={3}
            name="amount"
            className="block border border-gray-400 p-[12px] w-[100%] rounded-xl mb-4 w-[100%]"
          />

          <label htmlFor="BudgetCategory">Category</label>
          <select id="budgetCategory" name="category" ref={BudgetCategory} className="block border border-gray-400 w-[100%] p-[12px] rounded-xl">
            <option value="" disabled>
              Select a Category to Budget
            </option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400">
            {"e.g Transportation, Food, Utilities, Bills"}
          </p>
        <button
          type="submit"
          className="block hover:bg-indigo-300 mt-4 bg-indigo-500 rounded-xl cursor-pointer text-white p-[8px]"
        >
          Add Budget
        </button>
        </div>

      </form>
    </div>
  );
};

export default AddBudget;
