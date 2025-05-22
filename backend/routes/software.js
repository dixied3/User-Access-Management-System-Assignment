// File: backend/routes/software.js
const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const Software = require("../entities/Software");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

router.post("/", auth, role(["Admin"]), async (req, res) => {
  const { name, description, accessLevels } = req.body;
  const softwareRepo = getRepository("Software");
  const software = softwareRepo.create({ name, description, accessLevels });
  await softwareRepo.save(software);
  res.json({ message: "Software added" });
});

module.exports = router;