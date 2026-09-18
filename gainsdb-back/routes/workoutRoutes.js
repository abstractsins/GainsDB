import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../src/prisma.js";
import workoutProcessing from "../utils/workoutProcessing.js";

const router = express.Router();

const flattenWorkoutHistory = (workouts) =>
  workouts.flatMap((workout) =>
    workout.workout_exercises.flatMap((workoutExercise) =>
      workoutExercise.sets.map((set) => ({
        workout_id: workout.id,
        workout_date: workout.workout_date,
        exercise_id: workoutExercise.exercises.id,
        exercise_name: workoutExercise.exercises.name,
        set_order: set.set_order,
        weight: set.weight,
        reps: set.reps,
      })),
    ),
  );

router.get("/:userId/history", authMiddleware, async (req, res) => {
  console.log(`:userId/history get request`);
  const { userId } = req.params;
  const timeframe = req.query.timeframe || "all";
  const page = parseInt(req.query.page) || 1;
  const limit = timeframe === "all" ? 9 : null;
  const offset = limit ? (page - 1) * limit : null;

  console.log(`looking up workout history for user ${userId}`);
  console.log(`timeframe ${timeframe}`);

  try {
    const whereClause = {
      user_id: Number(userId),
    };

    if (timeframe !== "all") {
      const now = new Date();
      const timeframeMap = {
        "1w": 7,
        "2w": 14,
        "3w": 21,
        "4w": 28,
        "5w": 35,
        "6w": 42,
      };
      const days = timeframeMap[timeframe];

      if (!days) {
        return res.status(400).json({ error: "Invalid timeframe" });
      }

      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);

      whereClause.workout_date = {
        gte: startDate,
      };
    }

    const totalWorkoutsPromise = prisma.workouts.count({
      where: whereClause,
    });

    const workoutsPromise = prisma.workouts.findMany({
      where: whereClause,
      orderBy: {
        workout_date: "desc",
      },
      ...(timeframe === "all"
        ? {
            take: limit,
            skip: offset,
          }
        : {}),
      include: {
        workout_exercises: {
          include: {
            exercises: {
              select: {
                id: true,
                name: true,
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
        },
      },
    });

    const [totalWorkouts, workouts] = await Promise.all([
      totalWorkoutsPromise,
      workoutsPromise,
    ]);

    let totalPages = 1;
    const rows = flattenWorkoutHistory(workouts);
    const workoutsRefined = workoutProcessing(rows);

    if (timeframe === "all") {
      totalPages = Math.ceil(totalWorkouts / limit);
    }

    if (rows.length === 0) {
      return res
        .status(200)
        .json({ message: "No workouts found for this user" });
    }

    res.json({
      workouts: workoutsRefined,
      totalWorkouts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("💩💩💩 Something went wrong ¯\\_(ツ)_/¯");
    console.error(error);
  }
});

router.post("/:userId/log-workout", authMiddleware, async (req, res) => {
  console.log("post attempt");
  const { userId } = req.params;
  const { workoutDate, exercise, weight, reps } = req.body;
  const normalizedExercise = exercise.toLowerCase();

  console.log(`Logging exercise set for user ${userId}`);

  if (!workoutDate || !exercise || !weight || !reps) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const setOrder = await prisma.$transaction(async (tx) => {
      let workout = await tx.workouts.findFirst({
        where: {
          user_id: Number(userId),
          workout_date: new Date(workoutDate),
        },
        select: {
          id: true,
        },
      });

      if (!workout) {
        workout = await tx.workouts.create({
          data: {
            user_id: Number(userId),
            workout_date: new Date(workoutDate),
          },
          select: {
            id: true,
          },
        });
      }

      let exerciseRow = await tx.exercises.findUnique({
        where: {
          name: normalizedExercise,
        },
        select: {
          id: true,
        },
      });

      if (!exerciseRow) {
        exerciseRow = await tx.exercises.create({
          data: {
            name: normalizedExercise,
          },
          select: {
            id: true,
          },
        });
      }

      await tx.user_exercises.createMany({
        data: [
          {
            user_id: Number(userId),
            exercise_id: exerciseRow.id,
          },
        ],
        skipDuplicates: true,
      });

      let workoutExercise = await tx.workout_exercises.findFirst({
        where: {
          workout_id: workout.id,
          exercise_id: exerciseRow.id,
        },
        select: {
          id: true,
        },
      });

      if (!workoutExercise) {
        workoutExercise = await tx.workout_exercises.create({
          data: {
            workout_id: workout.id,
            exercise_id: exerciseRow.id,
          },
          select: {
            id: true,
          },
        });
      }

      const setOrder =
        (await tx.sets.count({
          where: {
            workout_exercise_id: workoutExercise.id,
          },
        })) + 1;

      await tx.sets.create({
        data: {
          workout_exercise_id: workoutExercise.id,
          weight,
          reps,
          set_order: setOrder,
        },
      });

      return setOrder;
    });

    res.status(201).json({
      message: "Workout set logged successfuly! LETS GOOOO!",
      setOrder,
    });
  } catch (error) {
    console.error("Database error: " + error);
    res.status(500).json({ error: "Internal server error trying to POST" });
  }
});

export default router;
