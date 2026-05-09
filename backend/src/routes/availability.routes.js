const express = require("express");
const router = express.Router();

const { getAvailability } = require("../controllers/availability.controller");
const { getWalkinAvailability } = require("../controllers/availability.controller");
router.get("/availability", getAvailability);
router.get("/walkin-availability", getWalkinAvailability);


module.exports = router;
