// frontend/src/api/expenses.js

const API = "http://localhost:5000/api/expenses";

// GET expenses (month + year)
export async function getExpenses(token, month, year) {
  const res = await fetch(`${API}?month=${month}&year=${year}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

// ADD expense
export async function addExpense(token, data) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      amount: Number(data.amount),
    }),
  });

  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
}

// UPDATE expense
export async function updateExpense(token, id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      amount: Number(data.amount),
    }),
  });

  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}

// DELETE expense
export async function deleteExpense(token, id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}
