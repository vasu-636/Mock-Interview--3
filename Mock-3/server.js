const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Campus Complaint Tracker API is running",
  });
});

app.use("/api/complaints", complaintRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});
