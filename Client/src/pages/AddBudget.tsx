/** @format */

import refreshClient from "../api/fetch";
import { useRef } from "react";
import { EXPENSE_CATEGORIES } from "../constants";

const AddBudget = () => {
  const BudgetAmount = useRef<HTMLInputElement>(null);
  const BudgetCategory = useRef<HTMLSelectElement>(null);
  // const menu = "expense";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const Budget = {
      budgetAmount: Number(BudgetAmount.current?.value.trim()),
      budgetCategory: BudgetCategory.current?.value.toLowerCase().trim(),
    };

    await refreshClient.post("/createBudget", Budget);

    BudgetAmount.current!.value = "";
    BudgetCategory.current!.value = "";
  };


  return(
    <div>
      <form onSubmit={handleSubmit}
        className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7" action="/success">

        <div>
          <label htmlFor="BudgetAmount">Amount</label>
          <input type="number" ref={BudgetAmount} id="budgetAmount" placeholder="enter a value" min={3} name="amount" />

          <label htmlFor="BudgetCategory">Category</label>
          <select id="budgetCategory" name="category" ref={BudgetCategory} >
            <option value="" disabled>
              Select an Expense to Budget
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
        </div>

        <button type="submit" className="button_addTask border border-amber-400">Add Budget</button>
      </form>
    </div>
  )
};


export default AddBudget;