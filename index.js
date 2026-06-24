import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= MongoDB Connection =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
  });

// ================= Student Schema =================

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

// ================= Attendance Schema =================

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["P", "A"],
    required: true,
  },
});

const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
);

// ================= Home Route =================

app.get("/", (req, res) => {
  res.send("Attendance Management System Backend");
});

// ================= Add Sugaash =================

app.get("/add-sugaash", async (req, res) => {
  try {
    await Student.deleteMany({});

    const student = await Student.create({
      rollNo: "24EIL128",
      name: "Sugaash",
    });

    res.json(student);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ================= Get Students =================

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ================= Save Attendance =================

app.post("/attendance", async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const attendance =
      await Attendance.findOneAndUpdate(
        {
          studentId,
          date,
        },
        {
          studentId,
          date,
          status,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ================= Get Attendance =================

app.get("/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("studentId");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ================= Start Server =================

const PORT = 3000;
app.get("/debug", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});