const mongoose = require("mongoose");

const prescribedMedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  instructions: { type: String }
});

const prescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  patientName: { type: String, required: true },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  medicines: [prescribedMedicineSchema],
  uploadedFile: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
