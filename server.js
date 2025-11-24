// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const medicineRoutes = require("./routes/medicineRoutes");
const userRoutes = require("./routes/userRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

app.use("/api/medicines", medicineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Cloud Medicine Tracker Backend is running 🚀");
});

// ------------------
// MongoDB connection
// ------------------
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ------------------
// Multer setup
// ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${ts}_${safeName}`);
  },
});
const upload = multer({ storage });

// Upload prescription route
app.post("/api/prescriptions/upload", upload.single("file"), async (req, res) => {
  try {
    const { patientId, doctorId, notes } = req.body;

    let medicines = [];
    if (req.body.medicines) {
      try {
        medicines = JSON.parse(req.body.medicines);
      } catch (e) {
        console.warn("Could not parse medicines JSON:", e.message);
      }
    }

    const fileInfo = req.file
      ? {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    // Save prescription
    const Prescription = require("./models/prescriptionModel");
    const savedPrescription = await Prescription.create({
      patientId: patientId || null,
      doctorId: doctorId || null,
      notes: notes || "",
      medicines,
      file: fileInfo ? fileInfo.path : null,
      createdAt: new Date(),
    });

    return res.json({
      message: "Upload successful",
      file: fileInfo,
      savedPrescription,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ------------------
// Start the server
// ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
