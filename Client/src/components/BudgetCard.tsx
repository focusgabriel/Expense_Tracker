/** @format */

import { Trash2 } from "lucide-react";
import { CATEGORY_COLORS } from "../constants";

interface BudgetCardProps {
  category: string;
  amount: number;
  budgetted: number;
  remains: number;
  // onDelete = () => 
  onDelete?: () => void;
}

const BudgetCard = ({
  category,
  amount,
  budgetted,
  remains,
  onDelete
}: BudgetCardProps) => {
  const normalizedKey = Object.keys(CATEGORY_COLORS).find(
    key => key.toLowerCase() === category.toLowerCase(),
  );

  const accentColor = normalizedKey
    ? CATEGORY_COLORS[normalizedKey]
    : "#10b981";
  const safeProgress = Math.max(0, Math.min(remains, 100));
  const remainingAmount = Math.max(0, budgetted - amount);

  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_22px_55px_-30px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-35px_rgba(15,23,42,0.35)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, rgba(255,255,255,0.18))`,
            }}
          >
            {category.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-base font-semibold capitalize tracking-tight text-slate-900">
              {category}
            </h2>
            <p className="text-xs text-slate-500">Budget category</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            ₦{amount.toFixed(2)} / ₦{budgetted.toFixed(2)}
          </p>
          <p className="text-xs font-medium text-slate-500">
            {safeProgress.toFixed(1)}% used 

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-0.5 rounded-md border border-red-200 bg-red-50 px-1.5 py-1 text-[10px] font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100 sm:px-2 sm:py-1 sm:text-[11px] lg:px-1.5 lg:py-0.5 lg:text-[10px] cursor-pointer"
              >
                <Trash2 size={11} className="sm:size-3 lg:size-2.5" />
                <span className="hidden sm:inline lg:hidden">Delete</span>
              </button>
            )}
          </p>

        </div>
      </div>

      <div className="mb-3 h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${safeProgress}%`,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
            boxShadow: `0 0 18px ${accentColor}66`,
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          {safeProgress >= 100
            ? "Over budget"
            : safeProgress > 80
              ? "Close to limit"
              : "On track"}
        </span>

        <span className="font-semibold text-slate-700">
          {safeProgress > 100
            ? `₦${Math.abs(remainingAmount).toFixed(2)} over`
            : `₦${remainingAmount.toFixed(2)} left`}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;
