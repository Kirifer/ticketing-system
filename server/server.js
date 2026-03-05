const express = require("express");
const path = require('path'); 
const cors = require("cors");
const upload = require("./middleware/upload");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const pool = require("./configs/db");     

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true               
}));

app.use(express.json());
app.use(cookieParser());

const ticketRouter = require("./routes/tickets");
app.use("/api/tickets", ticketRouter);

const adminRouter = require('./routes/admin');
app.use("/admin", adminRouter);

const adminLogsRouter = require('./routes/adminLogs');
const verifyAdmin = require('./middleware/auth');
app.use('/api/AdminLog', verifyAdmin, adminLogsRouter);

app.get('/admin/dashboard/data', verifyAdmin, async (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

