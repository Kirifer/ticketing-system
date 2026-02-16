require('dotenv').config(); 
const express = require('express');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Create 'uploads' folder safely
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Serve static files with absolute path
app.use('/uploads', express.static(uploadDir));

// 3. Database Connection with Error Logging
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// 4. Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// 5. Email Configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- AUTH ROUTES ---

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    
    console.log("--- Login Attempt ---");
    const securePassword = process.env.ADMIN_PASSWORD ;

    if (password === securePassword) {
        console.log("Login Status: SUCCESS");
        return res.status(200).json({ success: true });
    } else {
        console.log("Login Status: FAILED");
        return res.status(401).json({ success: false, message: "Invalid Password" });
    }
});

// --- USER ROUTES ---

app.post('/api/tickets', upload.single('image'), async (req, res) => {
    const { email, subject, description, fullName, category, priority } = req.body;
    const refNo = 'ITS-' + Math.floor(1000 + Math.random() * 9000);
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    try {
        const result = await pool.query(
            `INSERT INTO tickets 
            (reference_no, user_email, subject, description, full_name, category, priority, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [refNo, email, subject, description, fullName, category, priority, imageUrl]
        );

        await transporter.sendMail({
            from: `"ITSquarehub Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Ticket Created: ${refNo}`,
            text: `Hi ${fullName}! Your ${category} ticket has been received. Ref: ${refNo}`,
        });

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to create ticket" });
    }
});

app.get('/api/tickets/status', async (req, res) => {
    const { ref } = req.query;
    try {
        const result = await pool.query('SELECT * FROM tickets WHERE reference_no = $1', [ref]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Ticket not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/tickets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { status, email, refNo } = req.body;

    try {
        const query = status === 'Resolved' 
            ? 'UPDATE tickets SET status = $1, resolved_at = NOW() WHERE id = $2' 
            : 'UPDATE tickets SET status = $1, resolved_at = NULL WHERE id = $2';

        await pool.query(query, [status, id]);

        await transporter.sendMail({
            from: `"ITSquarehub Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Update on Ticket: ${refNo}`,
            text: `Hello, the status of your ticket (<b>${refNo}</b>) has been updated to: ${status}.`,
        });

        res.json({ success: true, message: "Status updated successfully" });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});