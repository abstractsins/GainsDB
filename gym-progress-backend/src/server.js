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

const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;

let allowedOrigins;

if (vercelEnv === 'preview' || vercelEnv === 'development') {

    allowedOrigins = [
        'https://gymprogress-development.up.railway.app',
        'https://gym-progress-git-dev-divs4us-projects.vercel.app',
    ];

} else if (vercelEnv === 'production') {

    allowedOrigins = [
        'https://gainsDB.com',
        'https://gainsdb.com',
        'https://www.gainsDB.com',
        'https://www.gainsdb.com',
        'https://gainsdb-prod.up.railway.app',
    ];

} else if (!vercelEnv) {

    allowedOrigins = [
        'http://localhost:3000',
        'http://10.0.0.116:3000',
        'http://10.0.0.107:3000'
    ]

}

app.options("*", cors()); // Automatically handle preflight requests

// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             console.error(`❌ CORS Blocked: ${origin}`);
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     allowedHeaders: "Content-Type,Authorization,Access-Control-Allow-Origin"
// }));

app.use(cors({
    origin: (origin, callback) => {
        console.log("💡 Incoming CORS origin:", origin);
        // Allow no-origin requests (like curl or mobile apps)
        if (!origin) return callback(null, true);

        // Check if any allowed origin matches the beginning of the origin string
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.error(`❌ CORS Blocked: ${origin}`);
        console.error(origin);
        console.error(allowedOrigins);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization,Access-Control-Allow-Origin"
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