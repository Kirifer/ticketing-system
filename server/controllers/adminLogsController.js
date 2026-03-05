const pool = require('../configs/db');
exports.getAdminLogs = async (req, res) => {
    try {
    const result = await pool.query(
      `SELECT * FROM "AdminLog" ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}