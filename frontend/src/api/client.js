// frontend/src/api/client.js

const BASE_URL = import.meta.env.VITE_API_URL;


// ADD EXPENSE
export const addExpense = async (data, token) => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add expense");
  }

  return res.json();
};

// GET ALL EXPENSES
export const getExpenses = async (token) => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return res.json();
};

// UPDATE EXPENSE
export const updateExpense = async (id, data, token) => {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update expense");
  }

  return res.json();
};

// DELETE EXPENSE
export const deleteExpense = async (id, token) => {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete expense");
  }

  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
};
