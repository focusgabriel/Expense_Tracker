/** @format */

import { useEffect, useState } from "react";
import Card from "./Card";
// import type { Transaction } from "../constants"

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  created_date: string;
};

const AllTrans = () => {
  const [trans, setTrans] = useState<Transaction[]>([]);
  
  // getting the whole data from the database 
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/getTransaction`)
      .then(res => res.json())
      .then(data => setTrans(data));
  }, []);

  return (
    <div className="w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:w-[33%] lg:min-w-[220px] lg:max-w-[280px]">
        <h2 className="border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black">Recent Transactions</h2>
        {trans.map((item, index) => (
          <Card
            key={index}
            type={item.type}
            amount={item.amount}
            category={item.category}
            description={item.description}
            date={item.date}
            created_date={item.created_date}
          />
        )).splice(0,5)}
        {/* splice to render only the first 5 from the database making it the top five recent transaction */}
      </div> 
  );
};

export default AllTrans;
