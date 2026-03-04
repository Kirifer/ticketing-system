const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.get("/dashboard/data", verifyAdmin, adminController.getDashboardData);

module.exports = router;