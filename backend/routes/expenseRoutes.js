// backend/routes/expenseRoutes.js
import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================
   CREATE EXPENSE
   POST /api/expenses
   body: { title, amount, date, category }
============================ */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;

    if (!title || !amount || !date || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const expense = new Expense({
      title,
      amount: Number(amount),
      date,
      category,
      userId: req.user.id,
    });

    await expense.save();
    return res.json({ message: "Expense added", expense });
  } catch (err) {
    console.error("CREATE EXPENSE ERROR:", err);
    return res.status(500).json({ message: "Failed to add expense" });
  }
});

/* ============================
   GET EXPENSES (MONTH FILTER)
   GET /api/expenses?month=10&year=2025
============================ */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    const filter = { userId };

    if (month && year) {
      const start = new Date(year, month, 1);
      const end = new Date(year, Number(month) + 1, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    return res.json(expenses);
  } catch (err) {
    console.error("FETCH EXPENSE ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

/* ============================
   UPDATE EXPENSE
   PUT /api/expenses/:id
============================ */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date, category } = req.body;

    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        ...(title !== undefined && { title }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(date !== undefined && { date }),
        ...(category !== undefined && { category }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json({ message: "Expense updated", expense: updated });
  } catch (err) {
    console.error("UPDATE EXPENSE ERROR:", err);
    return res.status(500).json({ message: "Failed to update expense" });
  }
});

/* ============================
   DELETE EXPENSE
   DELETE /api/expenses/:id
============================ */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE EXPENSE ERROR:", err);
    return res.status(500).json({ message: "Failed to delete" });
  }
});

export default router;
