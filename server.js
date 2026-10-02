require("dotenv").config();

const express = require("express");
const connectdb = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Expense Tracker API is running"
    });
});

app.use(errorMiddleware);

connectdb();

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});