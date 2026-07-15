/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditForm = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token")

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/updateTransaction/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error sending data");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("params:", id);

  const [formData, setFormData] = useState({
    type: "",
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    async function fetchTransaction() {
      if (id) {
        fetch(`http://localhost:3000/api/v1/getTransactionById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            setFormData({
              type: data.type,
              amount: data.amount,
              category: data.category,
              description: data.description,
              date: data.date,
            });
          })
          .catch(error => console.log(`Error: ${error}`));
      }
    }

    fetchTransaction();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      date: formData.date.split("T")[0],
      [e.target.name]:
        e.target.name === "amount" ? Number(e.target.value) : e.target.value,
    });
  };

  //   <Link to={`/edit/${formData._id}`}>
  //     Edit
  // </Link>
  console.log("categories:",formData.category);

  return (
    <div className="md:mx-auto md:max-w-4xl w-full rounded-3xl bg-white/90 p-6 sm:p-8">
      <div className="mb-6 rounded-3xl bg-emerald-50 p-6 text-center w-full ">
        <h2 className="text-2xl font-bold text-emerald-900">
          Add a Transaction
        </h2>
        <p className="mt-2 text-sm text-emerald-700">
          Track your income and expenses
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-7 rounded-3xl bg-white p-6 sm:grid-cols-2 sm:p-8"
        action="/success"
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="type" className="labelClass">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="fieldClass"
          >
            <option value="income">INCOME</option>
            <option value="expense">EXPENSE</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="amount" className="labelClass">
            Amount
          </label>
          <input
            id="amount"
            className="fieldClass"
            type="number"
            placeholder="Enter your amount"
            min={0}
            onWheel={event => event.currentTarget.blur()}
            value={formData.amount}
            onChange={handleChange}
            name="amount"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="category" className="labelClass">
            Category
          </label>
          <input
            id="category"
            className="fieldClass"
            type="text"
            placeholder="Enter the category"
            value={formData.category}
            onChange={handleChange}
            name="category"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="description" className="labelClass">
            Description
          </label>
          <input
            id="description"
            className="fieldClass"
            type="text"
            placeholder="Enter the description"
            minLength={7}
            value={formData.description}
            onChange={handleChange}
            name="description"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="date" className="labelClass">
            Date
          </label>
          <input
            id="date"
            className="fieldClass"
            type="date"
            value={formData.date.split("T")[0]}
            onChange={handleChange}
            name="date"
          />
        </div>

        <button
          type="submit"
          className="col-span-full rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer"
        >
          Save Transaction
          {/* <Link to="/task/success"></Link> */}
        </button>
      </form>
    </div>
  );
};

export default EditForm;
