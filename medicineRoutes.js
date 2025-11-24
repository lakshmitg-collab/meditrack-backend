 const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicineModel");


// ✅ Add a new medicine
router.post("/", async (req, res) => {
  console.log("📩 Received:", req.body); // <--- ADD THIS LINE

  try {
    const newMed = new Medicine(req.body);
    const savedMed = await newMed.save();
    res.json(savedMed);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(400).json({ error: err.message });
  }
});
// DELETE a medicine
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});



// ✅ Get all medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
