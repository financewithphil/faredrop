const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = db.getOne("SELECT id FROM users WHERE email = ?", [
    email.toLowerCase(),
  ]);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 12);

  db.run(
    "INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)",
    [id, email.toLowerCase(), passwordHash, displayName || null]
  );

  const token = jwt.sign(
    { userId: id, email: email.toLowerCase() },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.json({ token, user: { id, email: email.toLowerCase(), displayName } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = db.getOne("SELECT * FROM users WHERE email = ?", [
    email.toLowerCase(),
  ]);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, displayName: user.display_name },
  });
});

router.get("/me", verifyToken, (req, res) => {
  const user = db.getOne("SELECT id, email, display_name, created_at FROM users WHERE id = ?", [
    req.user.userId,
  ]);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

module.exports = router;
