const express = require("express");
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);
router.patch("/:id/status", updateComplaintStatus);
router.delete("/:id", deleteComplaint);

module.exports = router;
