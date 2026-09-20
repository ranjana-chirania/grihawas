const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Application Schema
const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    property: {
      type: String,
      required: true,
    },

    visitDate: {
      type: String,
    },

    configuration: {
      type: String,
      required: true,
    },

    budget: {
      type: String,
    },

    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB collection
const Application = mongoose.model("Application", applicationSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Registration/Application API
app.post("/api/apply", async (req, res) => {
  try {
    const application = new Application({
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      property: req.body.property,
      visitDate: req.body.visitDate,
      configuration: req.body.configuration,
      budget: req.body.budget,
      message: req.body.message,
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});