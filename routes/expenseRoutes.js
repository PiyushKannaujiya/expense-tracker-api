const express = require("express");

const router = express.Router();

const {
    createExpenseController,
    getAllExpenseController,
    getExpenseByIdController,
    deleteExpenseController,
    updateExpenseController,
    getExpenseStatsController,
    getCategoryStatsController,
    getMonthlyStatsController
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createExpenseController);

router.get("/", authMiddleware, getAllExpenseController);

router.get("/stats", authMiddleware, getExpenseStatsController);

router.get("/stats/category", authMiddleware, getCategoryStatsController);

router.get("/stats/monthly", authMiddleware, getMonthlyStatsController);

router.get("/:id", authMiddleware, getExpenseByIdController);

router.delete("/:id", authMiddleware, deleteExpenseController);

router.put("/:id", authMiddleware, updateExpenseController);




module.exports = router;