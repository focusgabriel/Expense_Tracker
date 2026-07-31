/** @format */

import { useEffect, useState } from "react";
import CardReview from "./CardReview";
import refreshClient from "../api/fetch";
import toast from "react-hot-toast";
import axios from "axios";
import OfflineStatus from "./OfflineStatus";
import {
  getLocalDashboardData,
  isBrowserOnline,
} from "../lib/offlineTransactions";

const MonthlyReport = () => {
  const [reviewIncome, setReviewIncome] = useState<number | null>(null);
  // const [reviewExpense, setReviewExpense] = useState<number | null>(null);
  const [reviewBalance, setReviewBalance] = useState<number | null>(null);

  const [formattedIncome, setFormattedIncome] = useState<string | null>(null);
  const [formattedExpense, setFormattedExpense] = useState<string | null>(null);
  const [formattedBalance, setFormattedBalance] = useState<string | null>(null);

  const [getDate, setGetDate] = useState<any>();
  const [isOffline, setIsOffline] = useState(!isBrowserOnline());

  const formatDate = (dateValue: string) => {
    const newDate = new Date(dateValue);
    return newDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    async function fetchData() {
      if (!isBrowserOnline()) {
        const local = getLocalDashboardData();
        setReviewIncome(local.get_income);
        setReviewBalance(local.summary.netBalance);
        setFormattedIncome(local.get_income.toLocaleString());
        setFormattedExpense(local.get_expense.toLocaleString());
        setFormattedBalance(local.summary.netBalance.toLocaleString());
        setGetDate(local.endOfLastMonth);
        setIsOffline(true);
        return;
      }

      try {
        const res = await refreshClient.get("/getMonthlyIncome");
        setReviewIncome(res.data.get_income);
        // setReviewExpense(res.data.get_expense);
        setReviewBalance(res.data.netbalance);

        setFormattedIncome(res.data.get_income.toLocaleString());
        setFormattedExpense(res.data.get_expense.toLocaleString());
        setFormattedBalance(res.data.netbalance.toLocaleString());

        setGetDate(res.data.endOfLastMonth);
        setIsOffline(false);
      } catch (error) {
        // Fall back to local data on error
        const local = getLocalDashboardData();
        setReviewIncome(local.get_income);
        setReviewBalance(local.summary.netBalance);
        setFormattedIncome(local.get_income.toLocaleString());
        setFormattedExpense(local.get_expense.toLocaleString());
        setFormattedBalance(local.summary.netBalance.toLocaleString());
        setGetDate(local.endOfLastMonth);
        setIsOffline(true);

        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message ?? "Can't get data at the moment.", {
            position: "top-right",
            duration: 3000,
          });
        } else {
          toast.error("Can't get data at the moment.", {
            position: "top-right",
            duration: 3000,
          });
        }
      }
    }

    fetchData();
  }, []);

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

  const balancePercentage =
    reviewIncome && reviewIncome !== 0 && reviewBalance != null
      ? Number(((reviewBalance / reviewIncome) * 100).toFixed(2))
      : null;

  return (
    <div className="w-full">
      <OfflineStatus isOffline={isOffline} />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Monthly Summary
            </h1>
            <p className="text-sm font-medium text-slate-500">
              {formatDate(getDate)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Current period
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CardReview title="Income" content={<span>{formattedIncome}</span>} />
          <CardReview
            title="Expense"
            content={<span>{formattedExpense}</span>}
          />
          <CardReview
            title="Net Balance"
            content={<span>{formattedBalance}</span>}
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