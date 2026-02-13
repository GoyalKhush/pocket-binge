import React from "react";
import ExpenseCard from "./ExpenseCard";

const ExpenseList = ({ expenses = [], onDelete, onEdit }) => {
  if (expenses.length === 0)
    return (
      <p className="text-gray-400 text-center mt-6">
        No expenses added yet. Start by adding one above 💸
      </p>
    );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {expenses.map((exp, idx) => (
        <ExpenseCard
          key={idx}
          {...exp}
          index={idx}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
