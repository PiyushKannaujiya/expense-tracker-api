const sendResponse = require("../utils/response");

const {
    createExpense,
    getAllExpense,
    getExpenseById,
    deleteExpense,
    updateExpense,
    getExpenseStats,
    getCategoryStats,
    getMonthlyStats
} = require("../services/expenseService");


// CREATE EXPENSE
const createExpenseController = async (req, res) => {
    const expenseData = {
        ...req.body,
        user: req.user.userId
    };

    const expense = await createExpense(expenseData);

    sendResponse(res, 201, expense);
};


// GET ALL EXPENSES
const getAllExpenseController = async (req, res) => {
    const userId = req.user.userId;

    const category = req.query.category;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const minAmount = req.query.minAmount;
    const maxAmount = req.query.maxAmount;
    const sortBy = req.query.sortBy;
    const order = req.query.order;
    const search = req.query.search;

    // Pagination
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            success: false,
            message: "Page must be a positive integer"
        });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({
            success: false,
            message: "Limit must be an integer between 1 and 100"
        });
    }

    // Amount validation
    if (minAmount !== undefined && isNaN(Number(minAmount))) {
        return res.status(400).json({
            success: false,
            message: "minAmount must be a valid number"
        });
    }

    if (maxAmount !== undefined && isNaN(Number(maxAmount))) {
        return res.status(400).json({
            success: false,
            message: "maxAmount must be a valid number"
        });
    }

    if (
        minAmount !== undefined &&
        maxAmount !== undefined &&
        Number(minAmount) > Number(maxAmount)
    ) {
        return res.status(400).json({
            success: false,
            message: "minAmount cannot be greater than maxAmount"
        });
    }

    // Date validation
    if (startDate && isNaN(Date.parse(startDate))) {
        return res.status(400).json({
            success: false,
            message: "startDate must be a valid date"
        });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
        return res.status(400).json({
            success: false,
            message: "endDate must be a valid date"
        });
    }

    // Date range validation
    if (
        startDate &&
        endDate &&
        new Date(startDate) > new Date(endDate)
    ) {
        return res.status(400).json({
            success: false,
            message: "startDate cannot be greater than endDate"
        });
    }

    const skip = (page - 1) * limit;

    // Valid categories
    const validCategories = [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Education",
        "Entertainment",
        "Other"
    ];

    // Valid sort fields
    const validSortFields = [
        "amount",
        "date",
        "title",
        "createdAt"
    ];

    // Category validation
    if (category && !validCategories.includes(category)) {
        return res.status(400).json({
            success: false,
            message: "Invalid category"
        });
    }

    // Sort field validation
    if (sortBy && !validSortFields.includes(sortBy)) {
        return res.status(400).json({
            success: false,
            message: "Invalid sort field"
        });
    }

    // Sort order validation
    if (order && order !== "asc" && order !== "desc") {
        return res.status(400).json({
            success: false,
            message: "Order must be asc or desc"
        });
    }

    const result = await getAllExpense(
        userId,
        category,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        sortBy,
        order,
        skip,
        limit,
        search
    );

    const totalPages = Math.ceil(result.total / limit);

    sendResponse(res, 200, {
        page,
        limit,
        total: result.total,
        totalPages,
        expenses: result.expenses
    });
};


// GET EXPENSE BY ID
const getExpenseByIdController = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;

    const expense = await getExpenseById(id, userId);

    if (!expense) {
        return res.status(404).json({
            success: false,
            message: "Expense not found"
        });
    }

    sendResponse(res, 200, expense);
};


// DELETE EXPENSE
const deleteExpenseController = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;

    const expense = await deleteExpense(id, userId);

    if (!expense) {
        return res.status(404).json({
            success: false,
            message: "Expense not found"
        });
    }

    sendResponse(res, 200, expense);
};


// UPDATE EXPENSE
const updateExpenseController = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;
    const expenseData = req.body;

    const expense = await updateExpense(
        id,
        userId,
        expenseData
    );

    if (!expense) {
        return res.status(404).json({
            success: false,
            message: "Expense not found"
        });
    }

    sendResponse(res, 200, expense);
};


// TOTAL EXPENSE STATISTICS
const getExpenseStatsController = async (req, res) => {
    const userId = req.user.userId;

    const result = await getExpenseStats(userId);

    const totalAmount = result.length > 0
        ? result[0].totalAmount
        : 0;

    sendResponse(res, 200, {
        totalAmount
    });
};


// CATEGORY STATISTICS
const getCategoryStatsController = async (req, res) => {
    const userId = req.user.userId;

    const result = await getCategoryStats(userId);

    sendResponse(res, 200, result);
};


// MONTHLY STATISTICS
const getMonthlyStatsController = async (req, res) => {
    const userId = req.user.userId;

    const result = await getMonthlyStats(userId);

    sendResponse(res, 200, result);
};


module.exports = {
    createExpenseController,
    getAllExpenseController,
    getExpenseByIdController,
    deleteExpenseController,
    updateExpenseController,
    getExpenseStatsController,
    getCategoryStatsController,
    getMonthlyStatsController
};