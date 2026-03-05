
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ticketController = require("../controllers/ticketController");

router.post("/", upload.single("image"), ticketController.createTicket);
router.get("/", ticketController.getAllTickets);
router.get("/:ticketRef", ticketController.getTicketByRef);
router.put("/:id/priority", ticketController.updateTicketPriority,);
router.put("/:id/status", ticketController.updateTicketStatus);
module.exports = router;