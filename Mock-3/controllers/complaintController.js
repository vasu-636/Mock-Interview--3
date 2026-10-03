const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

const VALID_STATUSES = ["Open", "In Progress", "Resolved", "Rejected"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildValidationMessage = (error) =>
  Object.values(error.errors)
    .map((item) => item.message)
    .join(", ");

const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    console.log(`Complaint created: ${complaint}`);
    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Validation Error:", error);

      return res.status(400).json({
        success: false,
        message: buildValidationMessage(error),
      });
    }

    console.error("Unexpected Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create complaint",
      error: error.message,
    });
  }
};

const getComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { studentName: regex }];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    console.log(` Complaints fetched: ${complaints}`);

    return res.status(200).json({
      success: true,
      message: "Complaints fetched successfully",
      count: complaints.length,
      data: complaints,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    console.log(`Complaint fetched: ${complaint}`);
    return res.status(200).json({
      success: true,
      message: "Complaint fetched successfully",
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint",
      error: error.message,
    });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    console.log(`Complaint updated: ${complaint}`);
    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: buildValidationMessage(error),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update complaint",
      error: error.message,
    });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status value. Allowed: Open, In Progress, Resolved, Rejected",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    console.log(`Complaint ${complaint._id} status changed to ${complaint.status}`);
    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
      error: error.message,
    });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    console.log(`Complaint deleted: ${complaint}`);
    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete complaint",
      error: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
};
