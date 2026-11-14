import { useState } from "react";
import refreshClient from "../api/fetch";
import BudgetCard from "./BudgetCard";

interface BudgetProps {
  amount: number;
  budgetCategory: string;
  percentage: number;
  budgetAmount: number;
}

const BudgetSummary = () => {
  const [budgets, setBudgets] = useState<BudgetProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      const response = await refreshClient.get("/budgetExpense");
      setBudgets(response.data);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchBudgets();
  // }, []);

  void fetchBudgets();

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Loading budgets...
        </div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-center py-4">
          <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182C9.232 6.219 10.06 6 11.25 6z" />
          </svg>
          <p className="text-gray-500 text-sm">No budgets set</p>
          <a href="/addBudget" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium inline-flex items-center gap-1 mt-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create one
          </a>
        </div>
      </div>
    );
  }

  const overBudgetCount = budgets.filter(b => b.percentage > 100).length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182C9.232 6.219 10.06 6 11.25 6z" />
          </svg>
          Budget Tracking
        </h3>
        <a href="/getBudget" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">View All</a>
      </div>

      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
        {budgets.slice(0, 4).map((item) => (
          <BudgetCard
            key={item.budgetCategory}
            amount={item.amount}
            category={item.budgetCategory}
            budgetted={item.budgetAmount}
            remains={item.percentage}
          />
        ))}
        {budgets.length > 4 && (
          <div className="text-center text-xs text-gray-500 py-1">
            +{budgets.length - 4} more categories
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total Budgeted</span>
          <span className="font-bold text-gray-900">${totalBudgeted.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total Spent</span>
          <span className="font-bold text-gray-900">${totalSpent.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Remaining</span>
          <span className="font-bold text-emerald-600">${(totalBudgeted - totalSpent).toFixed(2)}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className={`font-mono font-bold ${totalPercentage > 100 ? 'text-red-600' : totalPercentage > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                totalPercentage > 100 ? 'bg-red-500' : totalPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>{budgets.length} categories</span>
          <span className={overBudgetCount > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}>
            {overBudgetCount > 0 ? `${overBudgetCount} over budget` : 'All on track'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;