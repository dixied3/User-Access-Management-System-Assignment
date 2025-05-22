// File: backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getRepository } = require("typeorm");
const User = require("../entities/User");

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const userRepo = getRepository("User");
  const existing = await userRepo.findOne({ where: { username } });
  if (existing) return res.status(400).json({ message: "Username exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo.create({ username, password: hashed, role: "Employee" });
  await userRepo.save(user);
  res.json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userRepo = getRepository("User");
  const user = await userRepo.findOne({ where: { username } });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, role: user.role });
});

module.exports = router;