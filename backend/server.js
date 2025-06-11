// backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Gunakan route yang telah kamu ubah
const itemRoutes = require("./routes/items");
app.use("/items", itemRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
