// frontend/src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../api/expenses";
import { useNavigate } from "react-router-dom";

// Chart.js
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ---- basic state ----
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDark, setIsDark] = useState(true);

  // month/year filter
  const [month, setMonth] = useState(new Date().getMonth()); // 0-11
  const [year] = useState(new Date().getFullYear());

  // add-expense form
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "Food",
  });

  // edit modal
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "Food",
  });

  // insights modal
  const [showInsights, setShowInsights] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ---- helpers ----
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getEmoji = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("netflix") || t.includes("movie")) return "🎬";
    if (t.includes("pizza") || t.includes("food")) return "🍕";
    if (t.includes("grocery")) return "🛒";
    if (t.includes("electric") || t.includes("power")) return "💡";
    if (t.includes("shopping")) return "🛍️";
    return "⭐";
  };

  // ---- load data when month changes ----
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadExpenses();
  }, [month, token]); // refetch when month changes

  const loadExpenses = async () => {
    try {
      setError("");
      const data = await getExpenses(token, month, year);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load expenses");
    }
  };

  // ---- add expense ----
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setError("");
    setSuccess("");

    if (!form.title || !form.amount || !form.date) {
      setError("Please fill all fields");
      return;
    }

    try {
      await addExpense(token, form);
      setSuccess("Expense added successfully");
      setForm({
        title: "",
        amount: "",
        date: "",
        category: "Food",
      });
      await loadExpenses();
    } catch (err) {
      console.error("Add error:", err);
      setError("Failed to add expense");
    }
  };

  // ---- delete expense ----
  const handleDelete = async (id) => {
    try {
      await deleteExpense(token, id);
      await loadExpenses();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete expense");
    }
  };

  // ---- edit expense ----
  const openEdit = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      title: exp.title,
      amount: exp.amount,
      date: exp.date?.slice(0, 10) || "",
      category: exp.category || "Food",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateExpense(token, editingId, editForm);
      setEditingId(null);
      await loadExpenses();
      alert("Expense updated");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update expense");
    }
  };

  // ---- logout ----
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ---- export CSV ----
  const handleExportCSV = () => {
    if (!expenses.length) {
      alert("No expenses to export");
      return;
    }

    const header = ["Title", "Amount", "Date", "Category"];
    const rows = expenses.map((e) => [
      `"${e.title || ""}"`,
      e.amount,
      `"${formatDate(e.date)}"`,
      `"${e.category || ""}"`,
    ]);

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pocketbinge_${monthNames[month]}_${year}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---- export PDF (via browser print) ----
  const handleExportPDF = () => {
    // user can choose "Save as PDF" in print dialog
    window.print();
  };

  // ---- insights ----
  const totalSpent = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const categoryTotals = expenses.reduce((acc, exp) => {
    if (!exp.category) return acc;
    const key = exp.category;
    acc[key] = (acc[key] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});

  const topCategory =
    Object.keys(categoryTotals).length === 0
      ? null
      : Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#4ade80",
          "#60a5fa",
          "#f472b6",
          "#facc15",
          "#fb7185",
          "#a78bfa",
        ],
        borderColor: "#020617",
        borderWidth: 2,
      },
    ],
  };

  // ---- render ----
  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-slate-950 text-white"
          : "min-h-screen bg-slate-100 text-slate-900"
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HEADER ROW */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              PocketBinge
            </h1>
            <p className="text-sm text-gray-400">
              Dashboard Loaded Successfully 🎉
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* month select */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-full border border-gray-600 bg-slate-900 px-4 py-1 text-sm"
            >
              {monthNames.map((m, index) => (
                <option key={m} value={index}>
                  {m}
                </option>
              ))}
            </select>

            {/* dark / light toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-full border border-gray-600 bg-slate-900 px-4 py-1 text-sm"
            >
              {isDark ? "🌙 Dark" : "☀️ Light"}
            </button>

            {/* logout */}
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500 px-5 py-1 text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>
        </div>

        {/* TOP BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm shadow hover:bg-slate-700"
          >
            📄 Export PDF
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm shadow hover:bg-slate-700"
          >
            📊 Export CSV
          </button>

          <button
            onClick={() => setShowInsights(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm shadow hover:bg-slate-700"
          >
            📈 Insights
          </button>
        </div>

        {/* ADD EXPENSE CARD */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Expense Title"
              className="bg-slate-800 px-4 py-3 rounded-lg text-sm outline-none border border-slate-700 focus:border-green-400"
            />

            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleFormChange}
              placeholder="Amount ₹"
              className="bg-slate-800 px-4 py-3 rounded-lg text-sm outline-none border border-slate-700 focus:border-green-400"
            />

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleFormChange}
              className="bg-slate-800 px-4 py-3 rounded-lg text-sm outline-none border border-slate-700 focus:border-green-400"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="bg-slate-800 px-4 py-3 rounded-lg text-sm outline-none border border-slate-700 focus:border-green-400"
            >
              <option>Food</option>
              <option>Groceries</option>
              <option>Electricity</option>
              <option>Netflix</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
          </div>

          <button
            onClick={handleAdd}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg shadow"
          >
            Add Expense
          </button>

          {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
          {success && (
            <p className="text-green-400 mt-3 text-sm">{success}</p>
          )}
        </div>

        {/* EXPENSE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenses.map((exp) => (
            <div
              key={exp._id}
              className="bg-slate-900 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  {getEmoji(exp.title)} {exp.title}
                </h3>
              </div>

              <p className="text-green-400 text-xl font-bold">
                ₹ {exp.amount}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(exp.date)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {exp.category || "Other"}
              </p>

              <div className="flex gap-4 mt-4 text-sm">
                <button
                  onClick={() => openEdit(exp)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  ✏ Edit
                </button>

                <button
                  onClick={() => handleDelete(exp._id)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <p className="text-gray-400 text-sm">
              No expenses for {monthNames[month]} {year}. Try adding one!
            </p>
          )}
        </div>

        {/* BOTTOM: CHART + ALERTS */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {/* chart */}
          <div className="bg-slate-900 rounded-2xl p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
            {expenses.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                No data to show
              </div>
            ) : (
              <div className="h-64">
                <Pie data={pieData} />
              </div>
            )}
          </div>

          {/* alerts */}
          <div className="bg-slate-900 rounded-2xl p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Expense Alerts</h3>
            {totalSpent === 0 ? (
              <p className="text-green-400 text-sm">
                You are within your budget. Keep it up! ✅
              </p>
            ) : (
              <>
                <p className="text-yellow-300 text-sm mb-2">
                  ⚠ You have spent ₹{totalSpent} in{" "}
                  {monthNames[month]} {year}.
                </p>
                {topCategory && (
                  <p className="text-sm text-gray-300">
                    Top category:{" "}
                    <span className="font-semibold">
                      {topCategory[0]}
                    </span>{" "}
                    (₹{topCategory[1]})
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Edit Expense ✏
            </h2>

            <div className="space-y-3">
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700 focus:border-green-400 outline-none"
              />
              <input
                name="amount"
                type="number"
                value={editForm.amount}
                onChange={handleEditChange}
                className="w-full bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700 focus:border-green-400 outline-none"
              />
              <input
                name="date"
                type="date"
                value={editForm.date}
                onChange={handleEditChange}
                className="w-full bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700 focus:border-green-400 outline-none"
              />
              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                className="w-full bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700 focus:border-green-400 outline-none"
              >
                <option>Food</option>
                <option>Groceries</option>
                <option>Electricity</option>
                <option>Netflix</option>
                <option>Shopping</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSIGHTS MODAL */}
      {showInsights && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl text-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📈 Insights for {monthNames[month]} {year}
            </h2>
            <p className="mb-2">
              Total spent:{" "}
              <span className="font-semibold">₹{totalSpent}</span>
            </p>
            <p className="mb-2">
              Number of expenses:{" "}
              <span className="font-semibold">{expenses.length}</span>
            </p>
            {topCategory ? (
              <p className="mb-4">
                Highest category:{" "}
                <span className="font-semibold">
                  {topCategory[0]}
                </span>{" "}
                (₹{topCategory[1]})
              </p>
            ) : (
              <p className="mb-4 text-gray-400">
                No category breakdown available yet.
              </p>
            )}

            <button
              onClick={() => setShowInsights(false)}
              className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-black font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
