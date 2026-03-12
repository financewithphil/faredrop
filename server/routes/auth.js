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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = db.getOne("SELECT id, email FROM users WHERE email = ?", [
    email.toLowerCase(),
  ]);

  // Always return success to avoid leaking whether an email exists
  if (!user) {
    return res.json({ message: "If that email exists, a reset link has been sent." });
  }

  const resetToken = jwt.sign(
    { userId: user.id, email: user.email, purpose: "password-reset" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const resetUrl = `https://faredrop.onrender.com/?reset=${resetToken}`;

  if (process.env.SENDGRID_API_KEY) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    try {
      await sgMail.send({
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "alerts@faredrop.app",
        subject: "FareDrop — Reset Your Password",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #60a5fa;">Reset Your Password</h2>
            <p style="color: #64748b; font-size: 14px;">
              Click the button below to reset your FareDrop password. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: #60a5fa; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; margin: 16px 0;">
              Reset Password
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
              If you didn't request this, you can ignore this email.
            </p>
          </div>
        `,
      });
      console.log(`[AUTH] Password reset email sent to ${user.email}`);
    } catch (err) {
      console.error("[AUTH] Failed to send reset email:", err.message);
    }
  } else {
    console.log(`[AUTH] Reset link for ${user.email}: ${resetUrl}`);
  }

  res.json({ message: "If that email exists, a reset link has been sent." });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    const user = db.getOne("SELECT id FROM users WHERE id = ?", [decoded.userId]);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    db.run("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, user.id]);

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Reset link has expired. Please request a new one." });
    }
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }
});

router.get("/me", verifyToken, (req, res) => {
  const user = db.getOne("SELECT id, email, display_name, created_at FROM users WHERE id = ?", [
    req.user.userId,
  ]);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

module.exports = router;
