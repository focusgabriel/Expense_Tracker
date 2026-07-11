/** @format */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "./Card";
import DeleteModal from "./DeleteModal";
import type { Transaction } from "../constants";

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
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/deleteTransaction/${selected._id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      setTrans(prev => prev.filter(t => t._id !== selected._id));
      setModalOpen(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  // getting the whole data from the database
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/getTransaction`)
      .then(res => res.json())
      .then(data => setTrans(data));
  }, []);

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black">
        <h2>Recent Transactions</h2>
      </div>
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
