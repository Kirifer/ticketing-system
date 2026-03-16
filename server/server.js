import express from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import ticketRouter from './routes/tickets.js'
import adminRouter from './routes/admin.js'
import adminLogsRouter from './routes/adminLogs.js'
import verifyAdmin from './middleware/auth.js'
import helmet from 'helmet'
import adminAuthRoutes from './routes/admin.js';
import { fileURLToPath } from 'url'

const app = express();
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true               
}));
app.use(express.json());
app.use(cookieParser());
app.use('/admin', adminAuthRoutes);
app.use("/api/tickets", ticketRouter);
app.use("/admin", adminRouter);
app.use('/api/AdminLog', verifyAdmin, adminLogsRouter);
app.get('/admin/dashboard/data', verifyAdmin, async (req, res) => {
  res.json({ message: "Welcome Admin!" });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

