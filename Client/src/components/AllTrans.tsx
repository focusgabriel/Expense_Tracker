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
  date: string;
  created_date: string;
};

const AllTrans = () => {
  const [trans, setTrans] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/getTransaction`)
      .then(res => res.json())
      .then(data => setTrans(data));
  }, []);

  return (
    <div className="w-[35%]">
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
      </div> 
  );
};

export default AllTrans;
