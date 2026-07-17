/** @format */

import { useEffect, useState } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";
import type { Transaction } from "../constants";
import refreshClient from "../api/fetch";
// import type { Transaction } from "../constants"



const AllTrans = () => {
  // const navigate = useNavigate();
  const [trans, setTrans] = useState<Transaction[]>([]);
  // const handleEdit = (id: string) => navigate(`/edit/${id}`);

  // getting the whole data from the database
  useEffect(() => {
    refreshClient.get(`http://localhost:3000/api/v1/getTransaction`)
      .then(res => setTrans(res.data));
  }, []);

  return (
    <div className="w-full shrink-0 overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm lg:h-full lg:w-[33%] lg:min-w-55 lg:max-w-70">
      <div className="flex justify-between items-center border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black shrink-0">
        <h2>
          Recent Transactions
        </h2>

        <Link to="/analytics" className="lowercase text-sm text-blue-600">View All</Link>
      </div>
      <div className="flex flex-col lg:flex-1 lg:overflow-y-auto">
        {trans.map((item => (
          <Card
            key={item._id}
            id={item._id}
            type={item.type}
            amount={item.amount}
            category={item.category}
            description={item.description}
            date={item.date}
            created_date={item.created_date}
            // onEdit={() => handleEdit}
          />
        ))).splice(0,5)}
      </div>
      {/* splice to render only the first 5 from the database making it the top five recent transaction */}
    </div>
  );
};

export default AllTrans;
