/** @format */

import { useEffect, useState } from "react";
import CardReview from "./CardReview";
import refreshClient from "../api/fetch";
import toast from "react-hot-toast";
import axios from "axios";
import OfflineStatus from "./OfflineStatus";
import {
  getLocalMonthlyReport,
  isBrowserOnline,
} from "../lib/offlineTransactions";

type MonthOption = {
  key: string;
  label: string;
};

const buildMonthOptions = (): MonthOption[] => {
  const options: MonthOption[] = [];
  const today = new Date();

  for (let index = 0; index < 5; index += 1) {
    const current = new Date(today.getFullYear(), today.getMonth() - index, 1);
    options.push({
      key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
      label: current.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    });
  }

  return options;
};

const MonthlyReport = () => {
  const [monthOptions] = useState<MonthOption[]>(() => buildMonthOptions());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(
    monthOptions[0]?.key ?? "",
  );
  const [reviewIncome, setReviewIncome] = useState<number | null>(null);
  const [_reviewExpense, setReviewExpense] = useState<number | null>(null);
  const [reviewBalance, setReviewBalance] = useState<number | null>(null);
  const [formattedIncome, setFormattedIncome] = useState<string | null>(null);
  const [formattedExpense, setFormattedExpense] = useState<string | null>(null);
  const [formattedBalance, setFormattedBalance] = useState<string | null>(null);
  const [getDate, setGetDate] = useState<string | Date | null>(null);
  const [isOffline, setIsOffline] = useState(!isBrowserOnline());
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateValue: string | Date | null | undefined) => {
    if (!dateValue) return "Select a month";

    if (typeof dateValue === "string" && /^\d{4}-\d{2}$/.test(dateValue)) {
      const [year, month] = dateValue.split("-").map(Number);
      const parsed = new Date(year, (month || 1) - 1, 1);
      return parsed.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    const newDate = new Date(dateValue);
    return newDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const loadReport = async (monthKey: string) => {
    if (!monthKey) return;

    setIsLoading(true);

    if (!isBrowserOnline()) {
      const local = getLocalMonthlyReport(monthKey);
      setReviewIncome(local.get_income);
      setReviewExpense(local.get_expense);
      setReviewBalance(local.netbalance);
      setFormattedIncome(local.get_income.toLocaleString());
      setFormattedExpense(local.get_expense.toLocaleString());
      setFormattedBalance(local.netbalance.toLocaleString());
      setGetDate(monthKey);
      setIsOffline(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await refreshClient.get("/getMonthlyIncome", {
        params: { month: monthKey },
      });

      setReviewIncome(res.data.get_income ?? 0);
      setReviewExpense(res.data.get_expense ?? 0);
      setReviewBalance(res.data.netbalance ?? 0);
      setFormattedIncome((res.data.get_income ?? 0).toLocaleString());
      setFormattedExpense((res.data.get_expense ?? 0).toLocaleString());
      setFormattedBalance((res.data.netbalance ?? 0).toLocaleString());
      setGetDate(monthKey);
      setIsOffline(false);
    } catch (error) {
      const local = getLocalMonthlyReport(monthKey);
      setReviewIncome(local.get_income);
      setReviewExpense(local.get_expense);
      setReviewBalance(local.netbalance);
      setFormattedIncome(local.get_income.toLocaleString());
      setFormattedExpense(local.get_expense.toLocaleString());
      setFormattedBalance(local.netbalance.toLocaleString());
      setGetDate(monthKey);
      setIsOffline(true);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Can't get data at the moment.",
          {
            position: "top-right",
            duration: 3000,
          },
        );
      } else {
        toast.error("Can't get data at the moment.", {
          position: "top-right",
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedMonth) return;
    void loadReport(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!isBrowserOnline());
      if (selectedMonth) {
        void loadReport(selectedMonth);
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [selectedMonth]);

  const handleNavigate = (direction: -1 | 1) => {
    const nextIndex = selectedIndex + direction;

    if (nextIndex < 0 || nextIndex >= monthOptions.length) {
      return;
    }

    setSelectedIndex(nextIndex);
    setSelectedMonth(monthOptions[nextIndex].key);
  };

  const balancePercentage =
    reviewIncome && reviewIncome !== 0 && reviewBalance != null
      ? Number(((reviewBalance / reviewIncome) * 100).toFixed(2))
      : null;

  const selectedLabel = monthOptions[selectedIndex]?.label ?? "Current month";

  return (
    <div className="w-full">
      <OfflineStatus isOffline={isOffline} />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {formatDate(selectedMonth)}
            </h1>
            <p className="text-sm font-medium text-slate-500">
              {formatDate(getDate)}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => handleNavigate(1)}
              disabled={selectedIndex === monthOptions.length - 1}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ←
            </button>
            <div className="min-w-40 px-2 text-center text-sm font-semibold text-slate-700">
              {selectedLabel}
            </div>
            <button
              type="button"
              onClick={() => handleNavigate(-1)}
              disabled={selectedIndex === 0}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-slate-500">
          Showing the last 5 months of reports. Move through them as needed.
        </div>

        {isLoading && (
          <div className="mt-4 text-sm font-medium text-indigo-600">
            Loading report...
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CardReview
            title="Income"
            content={<span>{formattedIncome ?? "0"}</span>}
          />
          <CardReview
            title="Expense"
            content={<span>{formattedExpense ?? "0"}</span>}
          />
          <CardReview
            title="Net Balance"
            content={<span>{formattedBalance ?? "0"}</span>}
          />
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              BALANCE RATE
            </p>
            <p className="mt-1 text-xl font-bold text-green-600">
              {balancePercentage ?? 0}
              <span className="text-sm font-medium text-slate-400">%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
