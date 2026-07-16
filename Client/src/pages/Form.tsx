/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";

const EditForm = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token")

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/updateTransaction/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(formData);
      const data = response.data()
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
        axios.get(`http://localhost:3000/api/v1/getTransactionById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => 
            setFormData({
              type: res.data.type,
              amount: res.data.amount,
              category: res.data.category,
              description: res.data.description,
              date: res.data.date,
            })
          )
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
    <div className="md:mx-auto md:max-w-4xl w-full sm:rounded-3xl sm:bg-white/90 sm:p-8 p-0">
      <div className="mb-6 sm:rounded-3xl bg-emerald-50 sm:p-6 p-4 text-center w-full">
        <h2 className="text-2xl font-bold text-emerald-900">
          Add a Transaction
        </h2>
        <p className="mt-2 text-sm text-emerald-700">
          Track your income and expenses
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-7 sm:rounded-3xl sm:bg-white p-0 sm:p-8 sm:grid-cols-2"
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
