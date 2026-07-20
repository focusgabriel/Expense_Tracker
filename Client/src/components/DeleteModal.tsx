/** @format */

import type { Transaction } from "../constants";

const DeleteModal = ({
  open,
  transaction,
  onClose,
  onConfirm,
}: {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}) => {
  if (!open || !transaction) return null;

  const formatDate = (d: Date) => {
    const date = new Date(d);
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Delete transaction
              </h3>
              <p className="text-sm text-slate-500">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900 capitalize">
                {transaction.category}
                <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-indigo-600">
                  {transaction.type}
                </span>
              </div>
              {transaction.description && (
                <div className="mt-1 text-sm text-slate-500">
                  {transaction.description}
                </div>
              )}
            </div>
            <div className="text-right">
              <div
                className={`text-base font-bold ${transaction.type === "expense" ? "text-red-600" : "text-indigo-600"}`}
              >
                &#8358;{transaction.amount}
              </div>
              <div className="text-xs text-slate-400">
                {formatDate(transaction.date)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-red-700 hover:to-red-800 active:scale-[0.98]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;