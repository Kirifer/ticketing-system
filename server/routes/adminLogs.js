import express from 'express'
import getAdminLogs from '../controllers/adminLogsController.js'

const router = express.Router();

router.get("/", getAdminLogs);

export default router;