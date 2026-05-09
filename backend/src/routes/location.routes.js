const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");

router.post("/location-check", locationController.checkLocation);

module.exports = router;
