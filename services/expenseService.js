const Expense = require("../models/Expense");


// CREATE EXPENSE
const createExpense = async (expenseData) => {
    const expense = await Expense.create(expenseData);

    return expense;
};


// GET ALL EXPENSES
const getAllExpense = async (
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
) => {
    const filter = {
        user: userId
    };

    const sort = {};

    // Sorting
    if (sortBy) {
        sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
        sort.createdAt = -1;
    }

    // Category filter
    if (category) {
        filter.category = category;
    }

    // Date filter
    if (startDate) {
        filter.date = {
            $gte: new Date(startDate)
        };
    }

    if (endDate) {
        filter.date = {
            ...filter.date,
            $lte: new Date(endDate)
        };
    }

    // Amount filter
    if (minAmount || maxAmount) {
        filter.amount = {};
    }

    if (minAmount) {
        filter.amount.$gte = Number(minAmount);
    }

    if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
    }

    // Search
    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Get paginated expenses
    const expenses = await Expense.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    // Count total matching expenses
    const total = await Expense.countDocuments(filter);

    return {
        expenses,
        total
    };
};


// GET EXPENSE BY ID
const getExpenseById = async (id, userId) => {
    const expense = await Expense.findOne({
        _id: id,
        user: userId
    });

    return expense;
};


// DELETE EXPENSE
const deleteExpense = async (id, userId) => {
    const expense = await Expense.findOneAndDelete({
        _id: id,
        user: userId
    });

    return expense;
};


// UPDATE EXPENSE
const updateExpense = async (id, userId, expenseData) => {
    const expense = await Expense.findOneAndUpdate(
        {
            _id: id,
            user: userId
        },
        expenseData,
        {
            new: true,
            runValidators: true
        }
    );

    return expense;
};


// TOTAL EXPENSE STATISTICS
const getExpenseStats = async (userId) => {
    const result = await Expense.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    return result;
};


// CATEGORY STATISTICS
const getCategoryStats = async (userId) => {
    const result = await Expense.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: "$category",
                totalAmount: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    return result;
};


// MONTHLY STATISTICS
const getMonthlyStats = async (userId) => {
    const result = await Expense.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                totalAmount: {
                    $sum: "$amount"
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    return result;
};


module.exports = {
    createExpense,
    getAllExpense,
    getExpenseById,
    deleteExpense,
    updateExpense,
    getExpenseStats,
    getCategoryStats,
    getMonthlyStats
};