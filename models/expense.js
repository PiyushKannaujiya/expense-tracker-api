const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        title: {
            type: String,
            required: [true,"Title is required"],
            trim: true,
            minlength :[3,"Title must be at least 3 characters"]
        },

        amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0.01, "Amount must be greater than 0"]
},

        category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
        values: [
            "Food",
            "Travel",
            "Shopping",
            "Bills",
            "Education",
            "Entertainment",
            "Other"
        ],
        message: "Invalid category"
    }
},

        description: {
            type: String,
            trim: true
        },

        date: {
    type: Date,
    required: [true, "Date is required"]
}
    },
    {
        timestamps: true
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;