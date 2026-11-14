/** @format */

import { useEffect, useState } from "react";
import refreshClient from "../api/fetch";
import BudgetCard from "../components/BudgetCard";
import type { BudgetProps } from "../constants";
import DeleteBudget from "../components/DeleteBudget";
import toast from "react-hot-toast";

const GetBudget = () => {
  const [budgets, setBudgets] = useState<BudgetProps[]>([]);
  const [budget, setBudget] = useState<BudgetProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);

  useEffect(() => {

  let isMounted = true;
  
  const fetchBudgets = async () => {
    try {
      const response = await refreshClient.get("/budgetExpense");
      if(isMounted) {
        setBudgets(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
      if(isMounted) setBudgets([]);
    } finally {
      if(isMounted) setIsLoading(false);
    }
  };


  fetchBudgets();

  return () => {
    isMounted = false;
  }

  }, []);

  const totalBudgeted = budgets.reduce(
    (sum, budget) => sum + Number(budget.budgetAmount || 0),
    0,
  );
  const totalSpent = budgets.reduce(
    (sum, budget) => sum + Number(budget.amount || 0),
    0,
  );
  const totalPercentage =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    const handleDelete = async (bud: BudgetProps) => {

      setBudget(bud);
      setModal(true);
    }

      // if(del) {
      //   toast.success("Budget Successfully Deleted.", {
      //     position:"top-right",
      //     duration: 3000
      //   })

      // }
      // // setTimeout(() => {
        
      //   navigate("/getBudget");
      // // }, 2000);

    const handleConfirmDelete = async () => {

      if(!budget) return;

      const bud = budget
      try {
       await refreshClient.delete(`/deleteBudget/${bud?.budgetId}`);
       toast.success("Budget deleted successfully.", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.25)]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-base font-medium text-slate-600">
            Loading budgets...
          </p>
        </div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_35px_80px_-40px_rgba(15,23,42,0.2)]">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 mx-auto">
            <svg
              className="h-10 w-10 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182C9.232 6.219 10.06 6 11.25 6z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            No Budgets Yet
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            Create your first budget to start tracking your spending by
            category.
          </p>
          <a
            href="/addBudget"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Budget
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.22)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Budget planner
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Budget Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track spending across all your major categories.
            </p>
          </div>

          <a
            href="/addBudget"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Budget
          </a>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <section className="space-y-4">
            {budgets.map((item, index) => (
              <BudgetCard
                key={`${item.budgetCategory}-${index}`}
                amount={Number(item.amount || 0)}
                category={item.budgetCategory}
                budgetted={Number(item.budgetAmount || 0)}
                remains={Number(item.percentage || 0)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_30px_75px_-40px_rgba(15,23,42,0.25)] lg:sticky lg:top-24 lg:h-fit">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Total Summary
              </h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Total Budgeted</span>
                  <span className="text-base font-bold text-slate-900">
                    ₦{totalBudgeted.toFixed(2)}
                  </span>
                </div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Total Spent</span>
                  <span className="text-base font-bold text-slate-900">
                    ₦{totalSpent.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Remaining</span>
                  <span className="text-base font-bold text-emerald-600">
                    ₦{(totalBudgeted - totalSpent).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Overall Progress
                  </span>
                  <span
                    className={`font-bold ${
                      totalPercentage > 100
                        ? "text-red-600"
                        : totalPercentage > 80
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}
                  >
                    {totalPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      totalPercentage > 100
                        ? "bg-red-500"
                        : totalPercentage > 80
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {budgets.length}
                  </p>
                  <p className="text-[11px] text-slate-500">Categories</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      budgets.filter(item => Number(item.percentage || 0) > 100)
                        .length
                    }
                  </p>
                  <p className="text-[11px] text-slate-500">Over Budget</p>
                </div>
              </div>
            </div>
          </aside>

          <DeleteBudget 
            open={modal}
            budget={budget}
            onClose={() => {
              setModal(false);
              setBudget(null)
            }}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default GetBudget;
