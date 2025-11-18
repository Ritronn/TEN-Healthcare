import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import { protect } from "./middleware/authMiddleware.js";
import medicalHistoryRoutes from "./routes/medical.history.route.js";


dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan())

app.use("/api/auth", authRoutes);
app.use("/api/auth/medical-history", medicalHistoryRoutes);



app.get("/", (req, res) => {
  res.send("TEN Healthcare API is running...");
});

app.get("/api/test-protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, your token works!` });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
