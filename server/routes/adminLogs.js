const express = require("express");
const router = express.Router();
const adminLogsController = require("../controllers/adminLogsController");

router.get("/", adminLogsController.getAdminLogs);

module.exports = router;