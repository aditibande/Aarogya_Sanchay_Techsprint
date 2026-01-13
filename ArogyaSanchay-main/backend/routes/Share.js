const express = require("express");
const router = express.Router();
const ShareLink = require("../models/ShareLink");
const HealthRecord = require("../models/healthRecord");
const crypto = require("crypto");


router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const shareLink = await ShareLink.findOne({ token });

    if (!shareLink) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    if (shareLink.expiresAt < new Date()) {
      return res.status(410).json({ message: "Link has expired" });
    }

    const record = await HealthRecord.findById(shareLink.recordId)
      .populate("userId", "name email")
      .lean();

    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }

    const response = {
      recordId: record._id,
      type: record.type,
      title: record.title,
      description: record.description,
      doctor: record.doctor,
      date: record.date,
      files: record.files,
      tags: record.tags,
      createdAt: record.createdAt,
      owner: {
        id: record.userId?._id,
        name: record.userId?.name,
        email: record.userId?.email
      }
    };

    res.json(response);
  } catch (error) {
    console.error("Error in GET /api/share/:token:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
