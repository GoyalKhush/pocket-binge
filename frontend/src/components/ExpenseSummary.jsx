// frontend/src/components/ExpenseSummary.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import Charts from "./Charts";

const ExpenseSummary = ({ total, chartData }) => (
  <div className="mt-8 grid md:grid-cols-2 gap-6">
    <div className="bg-slate-900/90 p-6 rounded-2xl shadow-md border border-slate-800">
      <h2 className="text-lg font-semibold mb-4 text-sky-300">
        Expense Categories
      </h2>
      <Charts data={chartData} />
    </div>

    <div className="bg-slate-900/90 p-6 rounded-2xl shadow-md border border-slate-800">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-yellow-300">
        <AlertTriangle size={20} /> Expense Alerts
      </h2>
      {total > 15000 ? (
        <p className="text-yellow-300 text-sm mb-2">
          ⚠️ You’ve spent ₹{total}. Try reducing unnecessary expenses.
        </p>
      ) : total > 8000 ? (
        <p className="text-orange-300 text-sm mb-2">
          🔶 You’re nearing your budget with ₹{total}. Watch your spending.
        </p>
      ) : (
        <p className="text-emerald-300 text-sm mb-2">
          ✅ You’re within your budget. Keep it up!
        </p>
      )}
    </div>
  </div>
);

export default ExpenseSummary;
