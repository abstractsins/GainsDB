import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "../routes/authRoutes.js";
import workoutRoutes from "../routes/workoutRoutes.js";
import exerciseRoutes from "../routes/exerciseRoutes.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import settingsRoutes from "../routes/settingsRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

//* API Routes
app.use("/api", authRoutes);
app.use("/api/user", [workoutRoutes, exerciseRoutes, dashboardRoutes, profileRoutes, settingsRoutes]); 

//* Test Route
app.get("/", (req, res) => res.send("Server is running!"));

//* Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));