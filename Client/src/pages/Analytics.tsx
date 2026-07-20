/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../constants";
import Card from "../components/Card";
import DeleteModal from "../components/DeleteModal";
import refreshClient from "../api/fetch";

const Analytics = () => {
  const [trans, setTrans] = useState<Transaction[]>([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("created_date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleEdit = (id: string) => navigate(`/edit/${id}`);

  const handleDelete = (tx: Transaction) => {
    setSelected(tx);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      const res = await refreshClient.delete(
        `/deleteTransaction/${selected._id}`
      );
      console.log("response:", res);
      setTrans((prev) => prev.filter((t) => t._id !== selected._id));
      setModalOpen(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  // getting the whole data from the database
  useEffect(() => {
    refreshClient
      .get(`/getTransaction`, {
        params: {
          search,
          type,
          category,
          sort,
          order,
        },
      })
      .then((res) => setTrans(res.data));
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refreshClient
      .get(`http://localhost:3000/api/v1/getTransaction`, {
        params: {
          search,
          type,
          category,
          sort,
          order,
        },
      })
      .then((res) => setTrans(res.data));
  };

  return (
    <div className="w-full sm:rounded-lg sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm sm:flex sm:flex-col">
      <div className="flex justify-between items-center border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black shrink-0">
        <h2>Recent Transactions</h2>
      </div>

      <form onSubmit={onSubmit} className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Keyword..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Food"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="created_date">Created Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          {/* Order + Button group */}
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Order
              </label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 invisible">
                &nbsp;
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="flex flex-col">
        {trans.map((item) => (
          <Card
            key={item._id}
            id={item._id}
            type={item.type}
            amount={item.amount}
            category={item.category}
            description={item.description}
            date={item.date}
            created_date={item.created_date}
            onEdit={() => handleEdit(item._id)}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </div>

      <DeleteModal
        open={modalOpen}
        transaction={selected}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Analytics;