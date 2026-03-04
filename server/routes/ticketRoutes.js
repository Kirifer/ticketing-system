const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyAdmin = require("../middleware/auth");
const ticketController = require("../controllers/ticketController");

// Ticket routes
router.post("/", upload.single("image"), ticketController.createTicket);
router.get("/:ticketRef", ticketController.getTicketByRef);
router.get("/", ticketController.getAllTickets);
router.put("/:id/priority", verifyAdmin, ticketController.updatePriority);
router.put("/:id/status", verifyAdmin, ticketController.updateStatus);
router.get("/admin-logs", verifyAdmin, ticketController.getAdminLogs);

module.exports = router;