/** @format */

import toast from "react-hot-toast";
import { useRef, useEffect, useState } from "react";
import refreshClient from "../api/fetch";
import axios from "axios";
import OfflineStatus from "./OfflineStatus";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants";
import {
  isBrowserOnline,
  saveTransactionLocally,
  setTransactionSyncStatus,
  addPendingOperation,
} from "../lib/offlineTransactions";

const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AddTask = () => {
  const Type = useRef<HTMLSelectElement>(null);
  const Amount = useRef<HTMLInputElement>(null);
  const Category = useRef<HTMLSelectElement>(null);
  const Description = useRef<HTMLInputElement>(null);
  const newDate = useRef<HTMLInputElement>(null);
  const Current_date = useRef<HTMLInputElement>(null);
  const [isOffline, setIsOffline] = useState(!isBrowserOnline());
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "expense",
  );

  const categories =
    selectedType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (newDate.current) {
      newDate.current.value = getTodayString();
    }
    if (Current_date.current) {
      Current_date.current.value = getTodayString();
    }

    const updateOnlineStatus = () => {
      setIsOffline(!isBrowserOnline());
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      type: (Type.current?.value.toLowerCase() || "expense") as "income" | "expense",
      amount: Number(Amount.current?.value.trim() ?? 0),
      category: Category.current?.value.trim().toLowerCase() || "others",
      description: Description.current?.value.trim().toLowerCase() || "",
      date: newDate.current?.value || getTodayString(),
      created_date: Current_date.current?.value || getTodayString(),
    };

    const persisted = saveTransactionLocally(payload, !isBrowserOnline());

    try {
      if (isBrowserOnline()) {
        await refreshClient.post("/addTransaction", payload);
        setTransactionSyncStatus(persisted._id, false);

        toast.success("Transaction added successfully!", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.success("You're offline. Transaction saved locally.", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      setTransactionSyncStatus(persisted._id, true);
      addPendingOperation({
        id: persisted._id,
        type: "create",
        transaction: persisted,
      });

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong.", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.error("Something went wrong.", {
          position: "top-right",
          duration: 3000,
        });
      }
    }

    Amount.current!.value = "";
    Description.current!.value = "";
    Category.current!.value = "";
    newDate.current!.value = "";
  };

  return (
    <section className="md:mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl bg-linear-to-br from-indigo-50 to-indigo-100/60 p-6 text-center sm:p-8">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
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
          Add a Transaction
        </h2>
        <p className="mt-1 text-sm text-indigo-600/80">
          Track your expense from your income
        </p>
      </div>

      <OfflineStatus isOffline={isOffline} />

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7"
        action="/success"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="type"
            className="text-sm font-semibold text-slate-700"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            ref={Type}
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value as "income" | "expense");
              if (Category.current) {
                Category.current.value = "";
              }
            }}
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="income">INCOME</option>
            <option value="expense">EXPENSE</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="amount"
            className="text-sm font-semibold text-slate-700"
          >
            Amount
          </label>
          <input
            id="amount"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            type="number"
            placeholder="Enter your amount"
            min={3}
            onWheel={event => event.currentTarget.blur()}
            ref={Amount}
            name="amount"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="category"
            className="text-sm font-semibold text-slate-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            ref={Category}
            defaultValue=""
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="" disabled>
              Select a {selectedType} category
            </option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400">
            {selectedType === "income"
              ? "e.g. Salary, Freelance, Passive income"
              : "e.g. Food, Transportation, Bills"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-slate-700"
          >
            Description
          </label>
          <input
            id="description"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            type="text"
            placeholder="Enter the description"
            minLength={7}
            ref={Description}
            name="description"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="date"
            className="text-sm font-semibold text-slate-700"
          >
            Date
          </label>
          <input
            id="date"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            type="date"
            ref={newDate}
            name="date"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <button type="submit" className="button_addTask">
            Save Transaction
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddTask;
