import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../src/prisma.js";

const router = express.Router();

router.get("/:id/preferences", authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching settings for user ${id}`);

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        preferences: true,
      },
    });

    res.json(user ? [user] : []);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
