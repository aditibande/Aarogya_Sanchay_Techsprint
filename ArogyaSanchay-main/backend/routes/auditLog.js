const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const AuditLog = require("../models/Auditlog");
const logAction = require("../utils/LogAction");


router.get('/getLogsByUser/:userId', auth, async (req, res) => {
    try {
        const logs = await AuditLog.find({ userId: req.params.userId })
            .populate("recordId", "title type date")
            .sort({ timestamp: -1 });
            console.log("Fetching logs for user:", req.params.userId);


        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/getAllLogs', auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }

        const logs = await AuditLog.find()
            .populate("userId", "name email")
            .populate("recordId", "title type date")
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;