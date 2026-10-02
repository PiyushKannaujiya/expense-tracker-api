const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return user;
};

const loginUser = async (email, password) => {

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        user,
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};