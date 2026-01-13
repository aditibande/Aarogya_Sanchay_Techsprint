const express = require("express");
const router = express.Router();
const multer = require("multer");
const healthRecord = require("../models/healthRecord");
const authMiddleware = require("../middleware/authMiddleware");
const ShareLink = require("../models/ShareLink");
const User = require("../models/user");
const logAction = require("../utils/LogAction");
const AuditLog = require("../models/Auditlog");
const healthRecordController = require("../controller/healthRecordController");
const crypto = require("crypto");
require('dotenv').config()


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });



router.post(
  "/createRecord",
  authMiddleware,
  upload.single("file"), 
  async (req, res) => {
    try {
      const newRecordData = {
        ...req.body,
        userId: req.user.userId,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      };

    
      const newRecord = new healthRecord(newRecordData);
      await newRecord.save();

      await logAction(req.user.userId, "CREATE_RECORD", newRecord._id);
      
      
      res.status(201).json(newRecord);
    } catch (error) {
      console.error("CreateRecord Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);

router.get("/getRecords/:userId", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const { type } = req.query;
        const filter = { userId };
        if (type) filter.type = type;
        const records = await healthRecord.find(filter).sort({ date: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.put("/updateRecord/:recordId", authMiddleware, async (req, res) => {
    try {
        const { recordId } = req.params;
        const updatedRecord = await healthRecord.findByIdAndUpdate(recordId, req.body, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.delete("/deleteRecord/:recordId", authMiddleware, async (req, res) => {
    try {
        const { recordId } = req.params;
        const deletedRecord = await healthRecord.findByIdAndDelete(recordId);
        if (!deletedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.get('/searchRecords', authMiddleware, async (req, res) => {
    try {
        const { type, doctor, hospital, from, to, tag } = req.query;
        const query = { userId: req.user.userId };

        if (type) query.type = type;
        if (doctor) query["doctor.name"] = { $regex: doctor, $options: "i" };
        if (hospital) query["doctor.hospital"] = { $regex: hospital, $options: "i" };
        if (tag) query.tags = tag;
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from);
            if (to) query.date.$lte = new Date(to);
        }


        const records = await healthRecord.find(query).sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/shareRecord/:recordId/share', authMiddleware, async (req, res) => {
    try {
        const { recordId } = req.params;
        const token = crypto.randomBytes(16).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        const link = await ShareLink.create({ recordId, token, expiresAt });
        res.json({ link: `${process.env.BASE_URL}/api/share/${token}`, expiresAt });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.get("/:userId/health-id", authMiddleware, async (req, res) => {
    const { userId } = req.params;
    if (req.user.role !== "admin" && req.user.userId !== userId) {
        return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    const user = await User.findById(req.params.userId);
    res.json({ healthId: user.healthId });
});



module.exports = router;
