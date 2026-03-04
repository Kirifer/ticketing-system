const jwt = require("jsonwebtoken");

// Admin login
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    return res.json({ message: "Login successful" });
  }

  res.status(401).json({ message: "Invalid credentials" });
};

// Dashboard data (protected)
exports.getDashboardData = (req, res) => {
  res.json({ message: "Welcome Admin!" });
};