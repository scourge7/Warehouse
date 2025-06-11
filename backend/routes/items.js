// backend/routes/items.js
const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// GET semua item
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("items").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST item baru
router.post("/", async (req, res) => {
  try {
    const newItem = req.body;
    const docRef = await db.collection("items").add(newItem);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
