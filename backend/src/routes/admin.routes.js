const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const adminAuth = require("../middlewares/adminAuth");

router.post("/login", adminController.adminLogin);
router.get("/calendar", adminAuth, adminController.getCalendarOverview);
router.get("/tokens", adminAuth, adminController.getTokensByDate);
router.get("/dashboard", adminAuth, adminController.getDateDashboard);
router.get(
  "/physical-reference-entry",
  adminAuth,
  adminController.getTodayPhysicalReferenceEntries
);
router.put("/update-slots", adminAuth, adminController.updateSlots);
router.post("/set-tokens-per-hour", adminAuth, adminController.updateTokensPerHour);
router.get("/tokens-per-hour", adminController.getTokensPerHourPublic);
// ✅ EXPORT CSV
//router.get("/export-csv", adminAuth, adminController.exportTodayCSV);
router.get("/priority-settings", adminController.getPrioritySettings);

router.post("/update-priority-rules", adminController.updatePriorityRules);

router.post("/add-priority-district", adminController.addPriorityDistrict);

router.post("/delete-priority-district", adminController.deletePriorityDistrict);

router.post("/add-holiday", adminController.addHoliday);
router.delete("/delete-holiday", adminController.deleteHoliday);
router.get("/holidays", adminController.getHolidays);

module.exports = router;
