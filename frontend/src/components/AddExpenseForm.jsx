// frontend/src/components/AddExpenseForm.jsx
import React, { useState } from "react";

const categories = [
  "Food",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Rent",
  "Travel",
  "Other",
];

const AddExpenseForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return;

    onAdd({
      title,
      amount: Number(amount),
      date,
      category,
    });

    setTitle("");
    setAmount("");
    setDate("");
    setCategory("Food");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/80 rounded-2xl px-6 py-4 flex flex-col gap-4 shadow-md"
    >
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Expense Title"
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount ₹"
          className="w-40 px-4 py-2 rounded-lg bg-slate-800 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-400"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          className="w-44 px-4 py-2 rounded-lg bg-slate-800 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-400"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="w-40 px-4 py-2 rounded-lg bg-slate-800 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition"
      >
        Add Expense
      </button>
    </form>
  );
};

export default AddExpenseForm;
