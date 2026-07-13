/** @format */

type Transaction = {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string | Date;
};

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

  const formatDate = (d: string | Date) => {
    const date = new Date(d);
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-lg rounded-t-lg bg-white p-4 shadow-xl sm:rounded-lg sm:p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Confirm delete
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this transaction? This action can
            not be undone.
          </p>

          <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900 capitalize">
                  {transaction.category} ·{" "}
                  <span className="text-xs text-slate-500">
                    {transaction.type}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {transaction.description}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-bold ${transaction.type === "expense" ? "text-red-600" : "text-emerald-600"}`}
                >
                  &#8358;{transaction.amount}
                </div>
                <div className="text-xs text-slate-400">
                  {formatDate(transaction.date)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
