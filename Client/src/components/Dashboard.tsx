/** @format */

import { useEffect, useState } from "react";
import type { DashboardResponse } from "../types/dashboard";
import refreshClient from "../api/fetch";
import AllTransaction from "../pages/AllTransaction";
import SpendingChart from "./SpendingChart";
import MonthReview from "./MonthReview";
import DashboardSkeleton from "./dashboardSkeleton";
import {
  getLocalDashboardData,
  isBrowserOnline,
  syncPendingOperations,
} from "../lib/offlineTransactions";
import OfflineStatus from "./OfflineStatus";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );
  const [offline, setOffline] = useState(!isBrowserOnline());

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await refreshClient.get("/dashboard/");

        setDashboardData(res.data);
        setOffline(false);

        // Sync any pending operations after successful dashboard fetch
        const result = await syncPendingOperations();
        if (result.synced > 0) {
          // Refresh dashboard data after sync
          const refreshed = await refreshClient.get("/dashboard/");
          setDashboardData(refreshed.data);
        }
      } catch {
        setDashboardData(getLocalDashboardData());
        setOffline(!isBrowserOnline());
      }
    };

    const updateOnlineStatus = () => {
      setOffline(!isBrowserOnline());

      if (isBrowserOnline()) {
        void getDashboard();
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    void getDashboard();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (!dashboardData) return <DashboardSkeleton />;
  return (
    <div className="space-y-6">
      <OfflineStatus isOffline={offline} />
      <AllTransaction summary={dashboardData.summary} />
      <SpendingChart
        chartData={dashboardData.chartData}
        recentTransactions={dashboardData.recentTransactions}
      />
      <MonthReview
        get_income={dashboardData.get_income}
        get_expense={dashboardData.get_expense}
        monthlyBalance={dashboardData.monthlyBalance}
        firstDayOfCurrentMonth={dashboardData.firstDayOfCurrentMonth}
      />
    </div>
  );
};

export default Dashboard;
