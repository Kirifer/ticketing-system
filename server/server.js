require("dotenv").config();
const express = require("express");
const path = require('path'); 
const cors = require("cors");
const { Pool } = require("pg");
const upload = require("./middleware/upload");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true               
}));

app.use(express.json());
app.use(cookieParser());

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP server is ready");
  }
});


// Insert ticket
app.post("/api/tickets", upload.single("image"), async (req, res) => {
  const { name, email, issue, description, priority, status, date, ticketRef} = req.body;

  const image_path = req.file ? req.file.filename : null;

  try {
    const newTicket = await pool.query(
    `INSERT INTO tickets 
    (name, email, issue, description, priority, status, date, ticket_ref, image_path) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) 
    RETURNING *`,
    [name, email, issue, description, priority, status, date, ticketRef, image_path]
    );

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ticket Submission Confirmation",
      html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8" />
                <title>Ticket Confirmation</title>
              </head>
              <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

                <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
                  <tr>
                    <td align="center">

                      <table width="600" cellpadding="0" cellspacing="0" 
                            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                        <!-- Header -->
                        <tr>
                          <td style="background:#1e293b; padding:20px; text-align:center;">
                            <h2 style="color:#ffffff; margin:0;">IT Support Ticket Confirmation</h2>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:30px; color:#334155;">

                            <p style="font-size:16px;">Hello <strong>${name}</strong>,</p>

                            <p style="font-size:15px; line-height:1.6;">
                              Your support ticket has been successfully submitted. 
                              Our team will review it and get back to you as soon as possible.
                            </p>

                            <hr style="border:none; border-top:1px solid #e2e8f0; margin:20px 0;" />

                            <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;">
                              <tr>
                                <td><strong>Ticket Reference:</strong></td>
                                <td style="color:#2563eb;"><strong>${ticketRef}</strong></td>
                              </tr>
                              <tr>
                                <td><strong>Email:</strong></td>
                                <td>${email}</td>
                              </tr>
                              <tr>
                                <td><strong>Issue:</strong></td>
                                <td>${issue}</td>
                              </tr>
                              <tr>
                                <td><strong>Description:</strong></td>
                                <td>${description}</td>
                              </tr>
                              <tr>
                                <td><strong>Priority:</strong></td>
                                <td>${priority}</td>
                              </tr>
                              <tr>
                                <td><strong>Status:</strong></td>
                                <td>${status}</td>
                              </tr>
                              <tr>
                                <td><strong>Date Submitted:</strong></td>
                                <td>${date}</td>
                              </tr>
                            </table>

                            <hr style="border:none; border-top:1px solid #e2e8f0; margin:20px 0;" />

                            <p style="font-size:14px; color:#64748b;">
                              If you need further assistance, please reply to this email and include your ticket reference.
                            </p>

                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="background:#f1f5f9; text-align:center; padding:15px; font-size:12px; color:#64748b;">
                            © ${new Date().getFullYear()} ITSquareHub Support Team  
                            <br />
                            This is an automated message. Please do not reply directly.
                          </td>
                        </tr>

                      </table>

                    </td>
                  </tr>
                </table>

              </body>
              </html>
              `
    });

    res.json(newTicket.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//for ticket ref only
app.get("/api/tickets/:ticketRef", async(req, res) => {
  try {
    const ticketRef = req.params.ticketRef.trim();
    const result = await pool.query(
      "SELECT * FROM tickets WHERE ticket_ref = $1",
      [ticketRef]
    );
    if(result.rows.length === 0) {
      return res.status(404).json({message: 'Ticket not found.'})
    }
    res.json(result.rows[0])
  } catch(err){
    console.log(err.message)
    res.status(500).json({message: "Server Error"})
  }
})

//get all tickets
app.get("/api/tickets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tickets ORDER BY date DESC");
    res.json(result.rows); 
  } catch(err) {
    console.log(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});
const adminRouter = require('./admin');
app.use("/admin", adminRouter);
const verifyAdmin = require('./middleware/auth');

app.get('/admin/dashboard/data', verifyAdmin, async (req, res) => {
  // only accessible if logged in
  res.json({ message: "Welcome Admin!" });
});

app.put("/api/tickets/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await pool.query(
      "UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.json[updated.rows[0]];
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});








app.listen(5000, () => {
  console.log("Server running on port 5000");
});

