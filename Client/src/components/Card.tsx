/** @format */

import {
  CarFront,
  Wifi,
  Wallet,
  CookingPot,
  ShieldQuestionMark,
} from "lucide-react";

const Card = ({
  id,
  type,
  amount,
  category,
  description,
  date,
  created_date,
  onEdit,
  onDelete,
}) => {
  const formatDate = dateValue => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  // designing the card so as to render the recent transaction with a proper positioning and clearly informative
  return (
    <div className="grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-slate-100 px-3 py-3 transition last:border-b-0 hover:bg-slate-50">
      <h3 className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {/* in the category i added icons that would be attached to a specific category for proper visualization */}
        {category === "transportation" ? (
          <CarFront size={18} color="green" />
        ) : category === "bill" ? (
          <Wifi size={18} className="inline-block" />
        ) : category === "salary" ? (
          <Wallet size={18} color="green" />
        ) : category === "food" ? (
          <CookingPot size={18} />
        ) : (
          <ShieldQuestionMark size={20} />
        )}
      </h3>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-semibold capitalize leading-5 text-slate-900">
            {category}
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase leading-4 text-slate-500">
            {type}
          </span>
        </div>
        <p className="truncate text-xs leading-5 text-slate-500">
          {description || formatDate(date)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <div className="text-right">
          <h4
            className={`${type === "expense" ? "text-red-600 before:content-['-']" : "before:content-['+'] text-emerald-600"} whitespace-nowrap text-sm font-bold`}
          >
            &#8358;{amount}
          </h4>
          <span className="whitespace-nowrap text-[11px] leading-4 text-slate-400">
            {formatDate(date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-700 transition hover:border-red-300 hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
