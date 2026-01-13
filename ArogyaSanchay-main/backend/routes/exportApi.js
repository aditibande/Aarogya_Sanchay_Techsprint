const PDFDocument = require('pdfkit');
const express = require('express');
const router = express.Router();
const healthRecord = require("../models/healthRecord");
const authMiddleware = require("../middleware/authMiddleware");
const ShareLink = require("../models/ShareLink");

router.get("export/:userId", authMiddleware, async (req, res) => {
    const records = await healthRecord.find({ userId: req.params.userId });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    records.forEach(r => {
        doc.fontSize(14).text(`Title: ${r.title}`);
        doc.fontSize(12).text(`Type: ${r.type}`);
        doc.text(`Doctor: ${r.doctor?.name || "-"}`);
        doc.text(`Date: ${r.date}`);
        doc.text(`Description: ${r.description}`);
        doc.moveDown();
    });

    doc.end();
});

module.exports = router;