const express = require("express");
const router = express.Router();
const Prescription = require("../models/prescriptionModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, name);
  }
});
const upload = multer({ storage });

// ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Create prescription
router.post("/", upload.single("file"), async (req, res) => {
  try {
    let medicines = [];
    if (req.body.medicines) {
      medicines = JSON.parse(req.body.medicines);
    }

    const p = await Prescription.create({
      doctorId: req.body.doctorId,
      patientName: req.body.patientName,
      patientId: req.body.patientId || null,
      medicines,
      uploadedFile: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get prescriptions (with doctor name!)
router.get("/", async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;

    let filter = {};
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId; // ⭐ FIXED

    const list = await Prescription.find(filter)
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
