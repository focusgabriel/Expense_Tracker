/** @format */
import Card from "./Card";
import { Link } from "react-router-dom";
import type { Transaction } from "../constants";
// import type { Transaction } from "../constants"

interface TransactionProps {
  recentTransactions: Transaction[]
}

const AllTrans = ({recentTransactions}: TransactionProps) => {

   if (recentTransactions.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-500">
        <p className="text-lg font-semibold">No transactions yet</p>
        <p className="mt-2 text-sm">
          Add your first transaction to start tracking your finances.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full shrink-0 overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm lg:h-full lg:w-[33%] lg:min-w-55 lg:max-w-70">
      <div className="flex justify-between items-center border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black shrink-0">
        <h2>
          Recent Transactions
        </h2>

        <Link to="/analytics" className="lowercase text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</Link>
      </div>
      <div className="flex flex-col lg:flex-1 lg:overflow-y-auto">
        {recentTransactions.map((item => (
          <Card
            key={item._id}
            id={item._id}
            type={item.type}
            amount={item.amount}
            category={item.category}
            description={item.description}
            date={item.date}
            created_date={item.created_date}
          />
        )))}
      </div>
    </div>
  );
};

export default AllTrans;