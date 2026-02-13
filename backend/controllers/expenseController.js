export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    // Convert month/year to numbers
    const m = Number(month);
    const y = Number(year);

    // Start & end dates for that month
    const start = new Date(y, m, 1);      // 1st date of month
    const end = new Date(y, m + 1, 1);    // 1st of next month

    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lt: end }   // FILTER BY DATE RANGE
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    console.error("GET EXPENSE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};
