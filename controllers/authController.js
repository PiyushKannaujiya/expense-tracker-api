const sendResponse = require("../utils/response");
const { registerUser,
    loginUser
 } = require("../services/authService");

const registerController = async (req, res) => {
    const userData = req.body;

    const user = await registerUser(userData);

    // Never send password/hash to the client
    const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    sendResponse(res, 201, userResponse);
};

const loginController = async (req, res) => {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    const userResponse = {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email
    };

    sendResponse(res, 200, {
        user: userResponse,
        token: result.token
    });
};

module.exports = {
    registerController,
    loginController
};