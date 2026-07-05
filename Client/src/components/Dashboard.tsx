/** @format */

import AllTransaction from "./AllTransaction";
import MonthReview from "./MonthReview";
import SpendingChart from "./SpendingChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <AllTransaction />
      <SpendingChart />
      <MonthReview />
    </div>
  );
};

export default Dashboard;
