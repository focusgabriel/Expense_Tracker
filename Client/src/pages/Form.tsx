/** @format */
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import refreshClient from "../api/fetch";
import axios from "axios";
import OfflineStatus from "../components/OfflineStatus";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants";
import {
  isBrowserOnline,
  getStoredTransactionById,
  updateTransactionLocally,
  addPendingOperation,
} from "../lib/offlineTransactions";

const EditForm = () => {
  const { id } = useParams();
  const [isOffline, setIsOffline] = useState(!isBrowserOnline());

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      type: formData.type as "income" | "expense",
      amount: Number(formData.amount || 0),
      category: formData.category,
      description: formData.description,
      date: formData.date || new Date().toISOString().split("T")[0],
      created_date: new Date().toISOString().split("T")[0],
    };

    // Always save locally first
    const updated = updateTransactionLocally(id, payload);

    if (!isBrowserOnline()) {
      toast.success("Changes saved locally. Will sync when you're back online.", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    try {
      await refreshClient.patch(
        `/updateTransaction/${id}`,
        payload,
      );
      toast.success("Transaction updated successfully!", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      // If API fails, mark as pending operation for later sync
      if (updated) {
        addPendingOperation({
          id,
          type: "update",
          transaction: updated,
        });
      }

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Couldn't update transaction. Saved locally.", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.error("Couldn't update transaction. Saved locally.", {
          position: "top-right",
          duration: 3000,
        });
      }
    }
  };

  const [formData, setFormData] = useState({
    type: "",
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  const categories =
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    async function fetchTransaction() {
      if (!id) return;

      try {
        const res = await refreshClient.get(`/getTransactionById/${id}`);
        setFormData({
          type: res.data.type,
          amount: res.data.amount,
          category: res.data.category,
          description: res.data.description,
          date: res.data.date,
        });
        setIsOffline(false);
      } catch (error) {
        // Try to load from local storage if offline
        const local = getStoredTransactionById(id);
        if (local) {
          setFormData({
            type: local.type,
            amount: Number(local.amount || 0),
            category: local.category,
            description: local.description,
            date: typeof local.date === "string" ? local.date.split("T")[0] : "",
          });
          setIsOffline(true);
        } else {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ?? "Transaction not found.",
              {
                position: "top-right",
                duration: 3000,
              },
            );
          } else {
            toast.error("Transaction not found.", {
              position: "top-right",
              duration: 3000,
            });
          }
        }
      }
    }

    fetchTransaction();
  }, [id]);

  useEffect(() => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "amount" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      type: e.target.value,
      category: "",
    });
  };

  return (
    <section className="md:mx-auto w-full md:max-w-2xl">
      <OfflineStatus isOffline={isOffline} />
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
          Edit Transaction
        </h2>
        <p className="mt-1 text-sm text-indigo-600/80">Update your record</p>
      </div>

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
            value={formData.type}
            onChange={handleTypeChange}
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
            min={0}
            onWheel={event => event.currentTarget.blur()}
            value={formData.amount}
            onChange={handleChange}
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
            value={formData.category}
            onChange={handleChange}
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="" disabled>
              Select a {formData.type || "expense"} category
            </option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400">
            {formData.type === "income"
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
            value={formData.description}
            onChange={handleChange}
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
            value={formData.date.split("T")[0]}
            onChange={handleChange}
            name="date"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md active:scale-[0.98]"
          >
            Update Transaction
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditForm;
