const { Pool } = require("pg");
const nodemailer = require("nodemailer");
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
transporter.verify((err, success) => {
  if (err) console.log("SMTP ERROR:", err);
  else console.log("SMTP server ready");
});

exports.createTicket = async (req, res) => {
  const { name, email, issue, description, priority, status, date, ticketRef } = req.body;
  const image_path = req.file ? req.file.filename : null;

  try {
    const newTicket = await pool.query(
      `INSERT INTO tickets 
      (name, email, issue, description, priority, status, date, ticket_ref, image_path) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, email, issue, description, priority, status, date, ticketRef, image_path]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ticket Submission Confirmation",
      html: `<html>…same HTML you had…</html>` // Keep your styled email here
    });

    res.json(newTicket.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getTicketByRef = async (req, res) => {
  const ticketRef = req.params.ticketRef.trim();
  try {
    const result = await pool.query("SELECT * FROM tickets WHERE ticket_ref = $1", [ticketRef]);
    if (!result.rows.length) return res.status(404).json({ message: 'Ticket not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tickets ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updatePriority = async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;
  try {
    const current = await pool.query("SELECT priority, ticket_ref FROM tickets WHERE id = $1", [id]);
    if (!current.rows.length) return res.status(404).json({ message: "Ticket not found" });

    const updated = await pool.query("UPDATE tickets SET priority=$1 WHERE id=$2 RETURNING *", [priority, id]);
    await pool.query(`INSERT INTO "adminLogs" (ticket_ref, action, old_value, new_value) VALUES ($1,$2,$3,$4)`,
      [current.rows[0].ticket_ref, "Priority Change", current.rows[0].priority, priority]);

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const current = await pool.query("SELECT status, ticket_ref FROM tickets WHERE id = $1", [id]);
    if (!current.rows.length) return res.status(404).json({ message: "Ticket not found" });

    const updated = await pool.query("UPDATE tickets SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
    await pool.query(`INSERT INTO "adminLogs" (ticket_ref, action, old_value, new_value) VALUES ($1,$2,$3,$4)`,
      [current.rows[0].ticket_ref, "Status Change", current.rows[0].status, status]);

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAdminLogs = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "adminLogs" ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};