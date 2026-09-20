const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  },
);

// MongoDB collection
const Application = mongoose.model("Application", applicationSchema);
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
async function createAdmin() {
  try {
    const existingAdmin = await Admin.findOne({
      username: process.env.ADMIN_EMAIL,
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      await Admin.create({
        username: process.env.ADMIN_EMAIL,
        password: hashedPassword,
      });

      console.log("Admin account created successfully");
    }
  } catch (error) {
    console.error("Admin creation error:", error);
  }
}

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
app.get("/api/admin/applications", verifyAdmin, async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      applications: applications,
    });
  } catch (error) {
    console.error("Fetch applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
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

createAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
