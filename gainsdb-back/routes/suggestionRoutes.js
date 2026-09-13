import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";
import prisma from "../src/prisma.js";

const router = express.Router();

// post suggestion
router.post("/suggestions", authMiddleware, async (req, res) => {
  const { date, name, suggestion } = req.body;

  try {
    const created = await prisma.suggestions.create({
      data: {
        date: new Date(date),
        name,
        suggestion,
      },
    });
    res.json(created);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/suggestions", authMiddleware, async (req, res) => {
  try {
    const suggestions = await prisma.suggestions.findMany({
      orderBy: {
        id: "desc",
      },
    });
    res.json(suggestions);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
