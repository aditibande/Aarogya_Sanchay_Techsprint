const HealthRecord=require("../models/healthRecord");


exports.addRecord = async (req, res) => {
  try {
    const { type, description, date } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const record = new HealthRecord({
      userId: req.user.userId,
      type,
      description,
      date,
      fileUrl,
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Error saving record", error: err.message });
  }
};


exports.getRecords = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    const filter = { userId };
    if (type) filter.type = type;

    const records = await HealthRecord.find(filter).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
