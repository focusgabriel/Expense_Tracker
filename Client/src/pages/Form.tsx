/** @format */
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import refreshClient from "../api/fetch";
import axios from "axios";

const EditForm = () => {
  const { id } = useParams();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await refreshClient.patch(
        `/updateTransaction/${id}`,
        formData,
      );
      toast.success("Transaction updated successfully!", {
        position: "top-right",
        duration: 5000,
      });
      console.log(formData);
      const data = response.data();
      console.log(data);
    } catch (error) {
      if(axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong.");
      } else {
        "Something went wrong."
      }
    }
  };
  console.log("params:", id);

  const [formData, setFormData] = useState({
    type: "",
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    async function fetchTransaction() {
      if (id) {
        refreshClient
          .get(`/getTransactionById/${id}`)
          .then(res =>
            setFormData({
              type: res.data.type,
              amount: res.data.amount,
              category: res.data.category,
              description: res.data.description,
              date: res.data.date,
            }),
          )
          .catch(error => {
            if(axios.isAxiosError(error)) {
              toast.error(error.response?.data?.message ?? "Something went wrong.");
            } else {
              "Something went wrong."
            }
          });
        }
      }

      fetchTransaction();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      date: formData.date.split("T")[0],
      [e.target.name]:
        e.target.name === "amount" ? Number(e.target.value) : e.target.value,
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
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
            onChange={handleChange}
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
          <input
            id="category"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            type="text"
            placeholder="Enter the category"
            value={formData.category}
            onChange={handleChange}
            name="category"
          />
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
    </div>
  );
};

export default EditForm;
