const express = require("express");
const HealthID = require("../models/HealthID");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newRecord = new HealthID(req.body);
    await newRecord.save();
    console.log("Created Health ID:", newRecord);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.error("Error creating Health ID:", err);
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await HealthID.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const record = await HealthID.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updated = await HealthID.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await HealthID.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
