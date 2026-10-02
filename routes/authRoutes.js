const express = require("express");

const router = express.Router();

const {
    registerController,
    loginController
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;