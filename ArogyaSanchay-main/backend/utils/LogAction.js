const mongoose = require("mongoose");
const Log = require("../models/Auditlog"); 
const User = require("../models/user");

async function logAction(userId, action, recordId = null) {
  try {
    const doc = await Log.create({ userId, action, recordId, timestamp: new Date() });
    return doc;
  } catch (err) {
    console.error("Error logging action:", err.message);
    console.error({ userId, action, recordId });
  }
}

module.exports = logAction;
