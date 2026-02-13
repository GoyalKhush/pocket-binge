// frontend/src/components/ExpenseCard.jsx
import React, { useState } from "react";
import { Edit, Trash2, Save } from "lucide-react";

// 🧠 Auto-emoji based on title (your existing logic)
const getEmoji = (title) => {
  const t = title.toLowerCase();
  if (t.includes("pizza")) return "🍕";
  if (t.includes("coffee")) return "☕";
  if (t.includes("toast") || t.includes("bread")) return "🍞";
  if (t.includes("burger")) return "🍔";
  if (t.includes("movie") || t.includes("netflix")) return "🎬";
  if (t.includes("fuel") || t.includes("petrol")) return "⛽";
  if (t.includes("shopping")) return "🛍️";
  if (t.includes("travel") || t.includes("trip")) return "✈️";
  if (t.includes("electricity") || t.includes("bill")) return "💡";
  if (t.includes("rent")) return "🏠";
  if (t.includes("cosmetic") || t.includes("makeup")) return "💄";
  return "✨";
};

const ExpenseCard = ({
  expense,
  onDelete,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: expense.title,
    amount: expense.amount,
    date: expense.date?.slice(0, 10),
    category: expense.category,
  });

  const handleChange = (e) => {
    setDraft({ ...draft, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(expense._id, {
      ...draft,
      amount: Number(draft.amount),
    });
    setIsEditing(false);
  };

  const emoji = getEmoji(draft.title || expense.title);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 shadow-md flex flex-col gap-3 border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          {isEditing ? (
            <input
              name="title"
              value={draft.title}
              onChange={handleChange}
              className="bg-slate-800 text-slate-100 rounded px-2 py-1 text-sm"
            />
          ) : (
            <h3 className="text-lg font-semibold text-slate-100">
              {expense.title}
            </h3>
          )}
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-sky-700/60 text-sky-200">
          {expense.category}
        </span>
      </div>

      <div className="text-slate-200 text-xl font-bold">
        ₹{" "}
        {isEditing ? (
          <input
            name="amount"
            type="number"
            value={draft.amount}
            onChange={handleChange}
            className="bg-slate-800 text-slate-100 rounded px-2 py-1 text-sm w-24"
          />
        ) : (
          expense.amount
        )}
      </div>

      <div className="text-xs text-slate-400">
        {isEditing ? (
          <input
            type="date"
            name="date"
            value={draft.date}
            onChange={handleChange}
            className="bg-slate-800 text-slate-100 rounded px-2 py-1 text-xs"
          />
        ) : (
          new Date(expense.date).toLocaleDateString("en-IN")
        )}
      </div>

      <div className="flex justify-between mt-2 text-xs">
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
        >
          {isEditing ? <Save size={14} /> : <Edit size={14} />}
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="flex items-center gap-1 text-red-400 hover:text-red-300"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
