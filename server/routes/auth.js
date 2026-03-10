const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
  const { pin } = req.body;
  if (!pin || pin !== process.env.APP_PIN) {
    return res.status(401).json({ error: "Invalid PIN" });
  }
  const token = jwt.sign({ role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.json({ token });
});

module.exports = router;
