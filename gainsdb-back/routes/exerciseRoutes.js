import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../src/prisma.js";
import exerciseCategorizer from "../utils/exerciseCatagories.js";

const router = express.Router();

const normalizeExercise = (exercise) => {
  exercise = exercise.toLowerCase();
  exercise = exercise.replace(/[!@#$%^&*{}:-_]/g, " ");
  exercise = exercise.trim();
  return exercise;
};

const formatDateKey = (date) => {
  if (!date) return null;

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//* Fetch exercises
router.get("/:userId/exercises", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching exercises for user ${userId}`);

  try {
    const userExercises = await prisma.user_exercises.findMany({
      where: {
        user_id: Number(userId),
      },
      include: {
        exercises: {
          select: {
            id: true,
            name: true,
            created_at: true,
          },
        },
      },
    });

    const exerciseIds = userExercises.map((entry) => entry.exercise_id);

    const workoutExercises = exerciseIds.length
      ? await prisma.workout_exercises.findMany({
          where: {
            exercise_id: {
              in: exerciseIds,
            },
            workouts: {
              user_id: Number(userId),
            },
          },
          include: {
            workouts: {
              select: {
                workout_date: true,
              },
            },
          },
        })
      : [];

    const latestByExercise = new Map();

    for (const workoutExercise of workoutExercises) {
      const workoutDate = workoutExercise.workouts?.workout_date;
      const currentLatest = latestByExercise.get(workoutExercise.exercise_id);

      if (!currentLatest || workoutDate > currentLatest) {
        latestByExercise.set(workoutExercise.exercise_id, workoutDate);
      }
    }

    const rows = userExercises
      .map((entry) => {
        const exercise = entry.exercises;
        const latestWorkoutDate = latestByExercise.get(exercise.id);

        return {
          id: exercise.id,
          name: exercise.name,
          last_logged_date: latestWorkoutDate
            ? formatDateKey(latestWorkoutDate)
            : "TBD",
        };
      })
      .sort((left, right) => {
        const leftDate = left.last_logged_date === "TBD" ? "0000-00-00" : left.last_logged_date;
        const rightDate = right.last_logged_date === "TBD" ? "0000-00-00" : right.last_logged_date;
        return rightDate.localeCompare(leftDate);
      });

    res.json(exerciseCategorizer(rows));
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/:userId/exercises/:exerciseId/latest-workout",
  authMiddleware,
  async (req, res) => {
    try {
      const { userId, exerciseId } = req.params;

      const workoutExercises = await prisma.workout_exercises.findMany({
        where: {
          exercise_id: Number(exerciseId),
          workouts: {
            user_id: Number(userId),
          },
        },
        include: {
          workouts: {
            select: {
              id: true,
              workout_date: true,
              user_id: true,
            },
          },
          sets: {
            select: {
              set_order: true,
              weight: true,
              reps: true,
            },
            orderBy: {
              set_order: "asc",
            },
          },
        },
      });

      const latestWorkoutExercise = workoutExercises.sort(
        (left, right) =>
          right.workouts.workout_date - left.workouts.workout_date,
      )[0];

      if (!latestWorkoutExercise) {
        return res
          .status(404)
          .json({ error: "No recent workout found for this exercise." });
      }

      const rows = latestWorkoutExercise.sets.map((set) => ({
        workout_id: latestWorkoutExercise.workouts.id,
        workout_date: latestWorkoutExercise.workouts.workout_date,
        user_id: latestWorkoutExercise.workouts.user_id,
        set_order: set.set_order,
        weight: set.weight,
        reps: set.reps,
      }));

      res.json(rows);
    } catch (error) {
      console.error("Error fetching recent workout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

//* NEW EXERCISE
router.post("/:userId/exercises", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;
  const normalizedExercise = normalizeExercise(name);

  console.log("attempting to add exercise: " + name);

  if (!name) {
    return res.status(400).json({ error: "Exercise name is required." });
  }

  try {
    const user = Number(userId);

    const exercise = await prisma.$transaction(async (tx) => {
      let existingExercise = await tx.exercises.findUnique({
        where: {
          name: normalizedExercise,
        },
        select: {
          id: true,
        },
      });

      if (!existingExercise) {
        existingExercise = await tx.exercises.create({
          data: {
            name: normalizedExercise,
            created_by: user,
          },
          select: {
            id: true,
          },
        });
      }

      await tx.user_exercises.createMany({
        data: [
          {
            user_id: user,
            exercise_id: existingExercise.id,
          },
        ],
        skipDuplicates: true,
      });

      return existingExercise;
    });

    res
      .status(201)
      .json({ message: "Exercise added successfully", exercise: exercise.id });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/:userId/exercises/:exerciseId/volume-history",
  authMiddleware,
  async (req, res) => {
    try {
      const { userId, exerciseId } = req.params;

      const workoutExercises = await prisma.workout_exercises.findMany({
        where: {
          exercise_id: Number(exerciseId),
          workouts: {
            user_id: Number(userId),
          },
        },
        include: {
          workouts: {
            select: {
              workout_date: true,
            },
          },
          sets: {
            select: {
              weight: true,
              reps: true,
            },
          },
        },
      });

      const volumeByDate = new Map();

      for (const workoutExercise of workoutExercises) {
        const dateKey = formatDateKey(workoutExercise.workouts.workout_date);
        const currentVolume = volumeByDate.get(dateKey) || 0;
        const workoutVolume = workoutExercise.sets.reduce(
          (total, set) => total + Number(set.weight) * Number(set.reps),
          0,
        );

        volumeByDate.set(dateKey, currentVolume + workoutVolume);
      }

      const rows = Array.from(volumeByDate.entries())
        .map(([workout_date, total_volume]) => ({
          workout_date,
          total_volume,
        }))
        .sort((left, right) =>
          left.workout_date.localeCompare(right.workout_date),
        );

      if (rows.length === 0) {
        return res.status(404).json({ error: "No workout history found" });
      }

      res.json(rows);
    } catch (err) {
      console.log(err);
    }
  },
);

export default router;
