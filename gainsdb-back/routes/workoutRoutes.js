import express from "express";
import { Prisma } from "@prisma/client";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../src/prisma.js";
import workoutProcessing from "../utils/workoutProcessing.js";

const router = express.Router();

router.get(":/userId/history", authMiddleware, async (req, res) => {
  console.log(`:userId/history get request`);
  const { userId } = req.params;
  const timeframe = req.query.timeframe || "all";
  const page = parseInt(req.query.page) || 1;
  const limit = timeframe === "all" ? 9 : null;
  const offset = limit ? (page - 1) * limit : null;

  console.log(`looking up workout history for user ${userId}`);
  console.log(`timeframe ${timeframe}`);

  try {
    let rows = [];

    if (timeframe === "all") {
      rows = await prisma.$queryRaw(
        Prisma.sql`
            WITH PaginatedWorkouts AS (
                SELECT id AS workout_id, workout_date
                FROM workouts
                WHERE user_id = ${Number(userId)}
                ORDER BY workout_date DESC
                LIMIT ${limit} OFFSET ${offset}
            )
            SELECT 
                pw.workout_id, 
                pw.workout_date, 
                e.id AS exercise_id, 
                e.name AS exercise_name, 
                s.set_order, 
                s.weight, 
                s.reps
            FROM PaginatedWorkouts pw
            JOIN workout_exercises we ON pw.workout_id = we.workout_id
            JOIN exercises e ON we.exercise_id = e.id
            JOIN sets s ON we.id = s.workout_exercise_id
            ORDER BY pw.workout_date DESC, e.id, s.set_order;`,
      );
    } else {
      let interval;
      switch (timeframe) {
        case "1w":
          interval = "7 days";
          break;
        case "2w":
          interval = "14 days";
          break;
        case "3w":
          interval = "21 days";
          break;
        case "4w":
          interval = "28 days";
          break;
        case "5w":
          interval = "35 days";
          break;
        case "6w":
          interval = "42 days";
          break;
        default:
          return res.status(400).json({ error: "Invalid timeframe" });
      }

      rows = await prisma.$queryRaw(
        Prisma.sql`
        SELECT 
            w.id AS workout_id, 
            w.workout_date, 
            e.id AS exercise_id, 
            e.name AS exercise_name, 
            s.set_order, 
            s.weight, 
            s.reps
        FROM workouts w
        JOIN workout_exercises we ON w.id = we.workout_id
        JOIN exercises e ON we.exercise_id = e.id
        JOIN sets s ON we.id = s.workout_exercise_id
        WHERE w.user_id = ${Number(userId)} 
        AND w.workout_date >= NOW() - INTERVAL '${interval}'
        ORDER BY w.workout_date DESC, e.id, s.set_order;`,
      );
    }

    let totalPages = 1;
    let totalWorkouts = 0;
    const workoutsRefined = workoutProcessing(rows);

    if (timeframe === "all") {
      totalWorkouts = await prisma.workouts.count({
        where: {
          user_id: Number(userId),
        },
      });
      totalPages = Math.ceil(totalWorkouts / limit);
    } else {
      totalWorkouts = workoutsRefined.dates.length;
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
