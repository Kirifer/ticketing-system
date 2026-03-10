import express from 'express'
import upload from '../middleware/upload.js'
import * as  ticketController  from '../controllers/ticketController.js'

const router = express.Router();

router.post("/", upload.single("image"), ticketController.createTicket);
router.get("/", ticketController.getAllTickets);
router.get("/:ticketRef", ticketController.getTicketByRef);
router.put("/:id/priority", ticketController.updateTicketPriority,);
router.put("/:id/status", ticketController.updateTicketStatus);

export default router;