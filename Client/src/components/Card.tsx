/** @format */

import {
  CarFront,
  Wifi,
  Pencil,
  Trash2,
  UtilityPole,
  Spotlight,
  DollarSign,
  Utensils,
  CircleSlash,
  ShoppingBag,
  DumbbellIcon,
  Store,
} from "lucide-react";

const categoryIcon = (category?: string) => {
  switch (category) {
    case "transportation":
      return <CarFront size={18} />;
    case "utility":
      return <UtilityPole size={18} />;
    case "entertainment":
      return <Spotlight size={18} />;
    case "bill":
      return <Wifi size={18} />;
    case "salary":
      return <DollarSign size={18} />;
    case "food":
      return <Utensils size={18} />;
    case "food":
      return <ShoppingBag size={18} />;
    case "health":
    case "fitness":
      return <DumbbellIcon size={18} />;
    case "grocery":
      return <Store size={18} />;

    default:
      return <CircleSlash size={20} />;
  }
};

const formatDate = (dateValue: string | Date | undefined | null): string => {
  if (!dateValue) return "Unknown date";

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

const formatAmount = (amount: number | undefined | null): string => {
  if (amount == null) return "0";
  return amount.toLocaleString();
};

const Card = ({
  type,
  amount,
  category,
  description,
  date,
  onEdit,
  onDelete,
}: {
  id?: string;
  type?: "income" | "expense";
  amount?: number;
  category?: string;
  description?: string;
  date?: string | Date;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <div className="flex items-start gap-2 border-b border-slate-100 px-3 py-3 transition last:border-b-0 hover:bg-slate-50/80 sm:gap-3 sm:px-4 sm:py-3 lg:gap-2.5 lg:px-3 lg:py-2.5">
      {/* Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 lg:h-8 lg:w-8 ${
          type === "expense"
            ? "bg-red-50 text-red-500"
            : "bg-green-50 text-green-600"
        }`}
      >
        {categoryIcon(category)}
      </div>

      {/* Middle content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1 lg:gap-0.5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 lg:gap-1.5">
          <h3 className="text-xs font-semibold capitalize text-slate-900 sm:text-sm lg:text-xs">
            {category ?? "Uncategorized"}
          </h3>
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-3 sm:px-2 sm:text-[10px] sm:leading-4 lg:text-[9px] lg:px-1.5 ${
              type === "expense"
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {type ?? "expense"}
          </span>
        </div>
        {description ? (
          <p className="text-[11px] leading-4 text-slate-500 sm:text-xs sm:leading-5 lg:text-[13px] lg:leading-4">
            {description}
          </p>
        ) : (
          <p className="text-[11px] leading-4 text-slate-400 italic sm:text-xs sm:leading-5 lg:text-[12px] lg:leading-4">
            No description
          </p>
        )}
        <span className="text-[10px] text-slate-400 font-bold sm:text-[11px] lg:text-[10px]">
          ● {formatDate(date)}
        </span>
      </div>

      {/* Right side: amount + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0 sm:gap-2.5 lg:gap-1.5">
        <div className="text-right">
          <h4
            className={`whitespace-nowrap text-xs font-bold sm:text-sm lg:text-xs ${
              type === "expense" ? "text-red-600" : "text-green-600"
            }`}
          >
            {type === "expense" ? "-" : "+"}&#8358;{formatAmount(amount)}
          </h4>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 sm:px-2 sm:py-1 sm:text-[11px] lg:px-1.5 lg:py-0.5 lg:text-[10px] cursor-pointer"
              >
                <Pencil size={11} className="sm:size-3 lg:size-2.5" />
                <span className="hidden sm:inline lg:hidden">Edit</span>
              </button>
            )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;