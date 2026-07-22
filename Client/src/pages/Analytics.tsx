/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../constants";
import Card from "../components/Card";
import DeleteModal from "../components/DeleteModal";
import refreshClient from "../api/fetch";
import axios from "axios";
import toast from "react-hot-toast";

const Analytics = () => {
  const [trans, setTrans] = useState<Transaction[]>([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("created_date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const handleEdit = (id: string) => navigate(`/edit/${id}`);

  const handleDelete = (tx: Transaction) => {
    setSelected(tx);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await refreshClient.delete(
        `/deleteTransaction/${selected._id}`,
      );
      setTrans(prev => prev.filter(t => t._id !== selected._id));
      setModalOpen(false);
      setSelected(null);
    } catch (error) {
      if(axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message ?? "failed to delete item.");
        } else {
          "failed to delete item."
        }
    }
  };

  const onSubmit = async () => {
    try {
      const res = await refreshClient.get(
        `http://localhost:3000/api/v1/getTransaction`,
        {
          params: {
            search,
            type,
            category,
            sort,
            order,
            page,
            limit,
          },
        },
      );

      setTrans(res.data.data);
      setTotalPages(res.data.pagination.totalLimit);
    } catch (error) {
      if(axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message ?? "Error Fetching Transactions");
        } else {
          "Error Fetching Transactions"
        }
    }
  };

  useEffect(() => {
    onSubmit();
  }, [search, type, category, sort, order, page, limit]);

  return (
    <div className="w-full sm:rounded-lg sm:border sm:border-slate-200 sm:shadow-sm sm:flex sm:flex-col">
      <div className="border-b border-slate-100 px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide">
          All Transactions
        </h2>
      </div>

      {/* Filter Section */}
      <div className="px-4 pb-2 pt-4 sm:px-5 sm:pb-3 sm:pt-5">
        <button
          type="button"
          onClick={() => setShowFiltersMobile(prev => !prev)}
          className={`${showFiltersMobile ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:ring-indigo-200 hover:text-indigo-600'} mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-xs transition-all duration-200 sm:hidden`}
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
          {showFiltersMobile ? 'Hide Filters' : 'Show Filters'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 transition-transform duration-200 ${showFiltersMobile ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <form
          onSubmit={onSubmit}
          className={`${showFiltersMobile ? "block" : "hidden"} sm:block`}
        >
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 shadow-xs backdrop-blur-sm sm:p-5">
            <div className="flex flex-wrap items-end gap-3">
              {/* Search */}
              <div className="min-w-0 w-full sm:w-auto sm:flex-1 sm:min-w-[140px] lg:min-w-[180px]">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Search
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Keyword..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 shadow-xs transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="min-w-0 w-full sm:w-auto sm:min-w-[130px]">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={e => {
                      setType(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-700 shadow-xs transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Category */}
              <div className="min-w-0 w-full sm:w-auto sm:min-w-[130px]">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={e => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. Food"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-xs transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Sort By */}
              <div className="min-w-0 w-full sm:w-auto sm:min-w-[120px]">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-700 shadow-xs transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="created_date">Date</option>
                    <option value="amount">Amount</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Order */}
              <div className="min-w-0 w-full sm:w-auto sm:min-w-[120px]">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Order
                </label>
                <div className="relative">
                  <select
                    value={order}
                    onChange={e => {
                      setOrder(e.target.value as "asc" | "desc");
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-700 shadow-xs transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-end gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200/50 transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                {(search || type || category || sort !== "created_date" || order !== "desc") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setType("");
                      setCategory("");
                      setSort("created_date");
                      setOrder("desc");
                      setPage(1);
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-500 shadow-xs transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                    title="Clear filters"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col">
        {trans.map(item => (
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

      {trans.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
          <svg
            className="h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium text-slate-900">
            No transactions found
          </p>
          <p className="text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Page
          </span>
          <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
            {page}
          </span>
          <span className="text-sm text-slate-500">of {totalPages || 1}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:auto-cols-min sm:grid-flow-col">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition duration-200 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            Next
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
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