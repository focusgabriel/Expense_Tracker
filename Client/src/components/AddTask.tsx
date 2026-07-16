/** @format */

import { useRef } from "react";

const AddTask = () => {
  const Type = useRef<HTMLSelectElement>(null);
  const Amount = useRef<HTMLInputElement>(null);
  const Category = useRef<HTMLInputElement>(null);
  const Description = useRef<HTMLInputElement>(null);
  const newDate = useRef<HTMLInputElement>(null);
  const Current_date = useRef<HTMLInputElement>(null);

  const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTransaction = {
      type: Type.current?.value.toLowerCase(),
      amount: Number(Amount.current?.value.trim() ?? 0),
      category: Category.current?.value.trim().toLowerCase(),
      description: Description.current?.value.trim().toLowerCase(),
      date: newDate.current?.value,
      created_date: Current_date.current?.value,
    };
    console.log(newTransaction)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        "http://localhost:3000/api/v1/addTransaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newTransaction),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error sending data");
      }
      console.log(data);
      // await getTrans();
    } catch (error) {
      console.log(error);
    }

    Type.current.value = ""
    Amount.current.value = ""
    Description.current.value = ""
    Category.current.value = ""
    newDate.current.value = ""
    Current_date.current.value = ""
  };
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
            ref={Type}
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
            ref={Amount}
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
            ref={Category}
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
            ref={Description}
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
            ref={newDate}
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

export default AddTask;
