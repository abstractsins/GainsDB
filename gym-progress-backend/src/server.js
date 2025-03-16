import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "../routes/authRoutes.js";
import workoutRoutes from "../routes/workoutRoutes.js";
import exerciseRoutes from "../routes/exerciseRoutes.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import suggestionRoutes from "../routes/suggestionRoutes.js"

dotenv.config();

const app = express();

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const allowedOrigins = [
    'https://gainsDB.com',
    'https://gymprogress-development.up.railway.app',
    'http://localhost:3000',
    'http://10.0.0.116:3000',
    'http://10.0.0.107:3000', // Your phone's IP
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('not allowed by CORS');
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());
app.use(cookieParser());

//* API Routes
app.use("/api", authRoutes, suggestionRoutes);
app.use("/api/user", [workoutRoutes, exerciseRoutes, dashboardRoutes, profileRoutes]);

//* Test Route
app.get("/", (req, res) => res.send("Server is running!"));

//* Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));