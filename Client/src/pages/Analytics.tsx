/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Card from "./Card";
// import DeleteModal from "./DeleteModal";
import type { Transaction } from "../constants";
import Card from "../components/Card";
import DeleteModal from "../components/DeleteModal";
import axios from "axios";

const Analytics = () => {
  const [trans, setTrans] = useState<Transaction[]>([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const handleEdit = (id: string) => navigate(`/edit/${id}`);

  const handleDelete = (tx: Transaction) => {
    setSelected(tx);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    const token = localStorage.getItem("token")
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/deleteTransaction/${selected._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
      );
      console.log("response:", res);
      setTrans(prev => prev.filter(t => t._id !== selected._id));
      setModalOpen(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  // getting the whole data from the database
  const token = localStorage.getItem("token")
  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/getTransaction`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setTrans(res.data));
  }, []);

  return (
    <div className="w-full sm:rounded-lg sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm sm:flex sm:flex-col">
      <div className="flex justify-between items-center border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black shrink-0">
        <h2>Recent Transactions</h2>
      </div>
      <div className="flex flex-col">
        {trans.map(item => (
          <Card
            key={item._id}
            id={item._id}
            type={item.type}
            amount={item.amount}
            category={item.category}
            description={item.description}
            date={item.date}
            created_date={item.created_date}
            onEdit={() => handleEdit(item._id)}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </div>

      <DeleteModal
        open={modalOpen}
        transaction={selected}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* splice to render only the first 5 from the database making it the top five recent transaction */}
    </div>
  );
};

export default Analytics;
