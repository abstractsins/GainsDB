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
    'https://www.gainsDB.com',
    'https://gymprogress-development.up.railway.app',
    'http://localhost:3000',
    'http://10.0.0.116:3000',
    'http://10.0.0.107:3000' // Your phone's IP
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS Blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization"
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