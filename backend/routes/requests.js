// File: backend/routes/requests.js
const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const Request = require("../entities/Request");
const Software = require("../entities/Software");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

router.post("/", auth, role(["Employee"]), async (req, res) => {
  const { softwareId, accessType, reason } = req.body;
  const requestRepo = getRepository("Request");
  const software = await getRepository("Software").findOne(softwareId);
  const request = requestRepo.create({ user: { id: req.user.id }, software, accessType, reason });
  await requestRepo.save(request);
  res.json({ message: "Request submitted" });
});

router.patch("/:id", auth, role(["Manager"]), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const requestRepo = getRepository("Request");
  const request = await requestRepo.findOne(id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  request.status = status;
  await requestRepo.save(request);
  res.json({ message: `Request ${status}` });
});

module.exports = router;
