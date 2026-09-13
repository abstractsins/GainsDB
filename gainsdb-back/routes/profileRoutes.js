import bcrypt from "bcryptjs";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../src/prisma.js";

const router = express.Router();

//* Get Profile info
router.get("/:id/profile", authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching profile data for user ${id}`);

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        username: true,
        created_on: true,
        custom_name: true,
      },
    });

    res.json(user ? [user] : []);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//* Update custom name
router.post("/:id/custom-name", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { newCustomName } = req.body;

  if (!newCustomName) {
    return res.status(400).json({ error: "Custom name is required" });
  }

  // Ensure the authenticated user is updating their own name
  if (req.user.id !== parseInt(id, 10)) {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this user's name" });
  }

  try {
    const updateResult = await prisma.users.updateMany({
      where: {
        id: Number(id),
      },
      data: {
        custom_name: newCustomName,
      },
    });

    if (updateResult.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "Custom name updated successfully dude!", user });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//* update username
router.post("/:id/username", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { newUsername } = req.body;

  if (!newUsername) {
    return res.status(400).json({ error: "New username is required" });
  }

  // Ensure the authenticated user is updating their own name
  if (req.user.id !== parseInt(id, 10)) {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this username" });
  }

  try {
    const updateResult = await prisma.users.updateMany({
      where: {
        id: Number(id),
      },
      data: {
        username: newUsername,
      },
    });

    if (updateResult.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "You now have a new username!", user });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "That username is taken" });
    }

    console.error("Database error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//* update password
router.post("/:id/password", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  // Ensure the authenticated user is updating their own name
  if (req.user.id !== parseInt(id, 10)) {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this password" });
  }

  try {
    const saltRounds = 10; // Adjust for security (higher = slower hashing)
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    const updateResult = await prisma.users.updateMany({
      where: {
        id: Number(id),
      },
      data: {
        password: hashedNewPassword,
      },
    });

    if (updateResult.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "Use your new password responsibly!", user });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
