import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//!
//* Fetch weights
router.get("/weight", authMiddleware, async (req, res) => {
  const authHeader = req.headers.authorization;
  const { userId } = req.params;

  if (!authHeader) return res.status(401).send("No token");

  const token = authHeader.split(" ")[1];

  console.log(`Fetching weight logs for user ${userId}`);

  try {
  } catch (e) {}
});

//* Add weight entry

//* Remove/edit weight entry
