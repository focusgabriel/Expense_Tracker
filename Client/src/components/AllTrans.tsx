/** @format */

import { useEffect, useState } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";
import type { Transaction } from "../constants";
// import type { Transaction } from "../constants"



const AllTrans = () => {
  const [trans, setTrans] = useState<Transaction[]>([]);

  // getting the whole data from the database
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/getAllUserData`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTrans(data));
  }, []);

  return (
    <div className="w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:w-[33%] lg:min-w-55 lg:max-w-70">
      <div className="flex justify-between items-center border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black">
        <h2>
          Recent Transactions
        </h2>

        <Link to="/analytics" className="lowercase text-sm text-blue-600">View All</Link>
      </div>
      {trans.map((item => (
        <Card
          id={item._id}
          type={item.type}
          amount={item.amount}
          category={item.category}
          description={item.description}
          date={item.date}
        />
      ))).splice(0,5)}
      {/* splice to render only the first 5 from the database making it the top five recent transaction */}
    </div>
  );
};

export default AllTrans;
