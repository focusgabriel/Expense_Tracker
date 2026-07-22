import { useEffect, useState } from "react"
import type { DashboardResponse } from "../types/dashboard"
import refreshClient from "../api/fetch";
import AllTransaction from "../pages/AllTransaction";
import SpendingChart from "./SpendingChart";
import MonthReview from "./MonthReview";
import DashboardSkeleton from "./dashboardSkeleton";

const Dashboard = () => {
  const [errorMsg, setErrorMsg] = useState("");
  
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  useEffect(() => {
    
    const getDashboard = async () => {
      try {
        const res = await refreshClient.get("/dashboard/")

        setDashboardData(res.data);
      } catch {
        setErrorMsg("error loading transactions")
      }
    }

    getDashboard()
  }, [])

  console.log(dashboardData?.authenticatedUser.name)

//   try {
//   const res = await refreshClient.get("/dashboard");
//   setDashboardData(res.data);
// } catch (err) {
//   setErrorMsg("Unable to load dashboard.");
// }
    // }
if (errorMsg) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
      {errorMsg}
    </div>
  );
} 
// if (dashboardData.recentTransactions.length === 0) {
//   return (
//     <div className="flex h-64 items-center justify-center text-slate-500">
//       No transactions yet.
//     </div>
//   );
// }

  if(!dashboardData) return <DashboardSkeleton />
  return (
    <div className="space-y-6">
      <AllTransaction summary={dashboardData.summary} />
      <SpendingChart chartData={dashboardData.chartData} recentTransactions={dashboardData.recentTransactions} />
      <MonthReview />
    </div>
  )
}

export default Dashboard