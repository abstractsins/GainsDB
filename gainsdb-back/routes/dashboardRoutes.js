import express from "express";
import prismaClientPkg from "@prisma/client";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../src/prisma.js";

const { Prisma } = prismaClientPkg;

const router = express.Router();

function toJsonSafe(value) {
  return JSON.parse(
    JSON.stringify(value, (_, current) => {
      if (typeof current === "bigint") {
        return Number(current);
      }

      if (current instanceof Prisma.Decimal) {
        return current.toNumber();
      }

      return current;
    }),
  );
}

//* Dashboard
router.get("/:userId/dashboard", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching Dashboard for user " + userId);

  const userIdNumber = Number(userId);

  const [
    totalWeeksResult,
    totalWorkoutsResult,
    mostLoggedExe,
    theMostWeight,
    mostVolumeChange,
  ] = await Promise.all([
    prisma.$queryRaw(
      Prisma.sql`SELECT COUNT(DISTINCT DATE_TRUNC('week', workout_date)) AS total_weeks
          FROM workouts
          WHERE user_id = ${userIdNumber}`,
    ),
    prisma.workouts.count({
      where: {
        user_id: userIdNumber,
      },
    }),
    prisma.$queryRaw(
      Prisma.sql`SELECT
          e.id AS exercise_id,
          e.name AS exercise_name,
          COUNT(we.exercise_id) AS log_count
        FROM workout_exercises we
        JOIN workouts w ON we.workout_id = w.id
        JOIN exercises e ON we.exercise_id = e.id
        WHERE w.user_id = ${userIdNumber}
        GROUP BY e.id, e.name
        ORDER BY log_count DESC`,
    ),
    prisma.$queryRaw(
      Prisma.sql`SELECT
          e.id AS exercise_id,
          e.name AS exercise_name,
          MAX(s.weight) AS max_weight
        FROM sets s
        JOIN workout_exercises we ON s.workout_exercise_id = we.id
        JOIN workouts w ON we.workout_id = w.id
        JOIN exercises e ON we.exercise_id = e.id
        WHERE w.user_id = ${userIdNumber}
        GROUP BY e.id, e.name
        ORDER BY max_weight DESC`,
    ),
    prisma.$queryRaw(
      Prisma.sql`WITH volume_progress AS (
          SELECT
            we.exercise_id,
            e.name AS exercise_name,
            w.workout_date,
            SUM(s.weight * s.reps) AS volume
          FROM sets s
          JOIN workout_exercises we ON s.workout_exercise_id = we.id
          JOIN workouts w ON we.workout_id = w.id
          JOIN exercises e ON we.exercise_id = e.id
          WHERE w.user_id = ${userIdNumber}
          GROUP BY we.exercise_id, e.name, w.workout_date
        )
        SELECT
          exercise_id,
          exercise_name,
          MIN(volume) AS min_volume,
          MAX(volume) AS max_volume,
          (MAX(volume) - MIN(volume)) AS volume_change
        FROM volume_progress
        GROUP BY exercise_id, exercise_name
        HAVING MIN(volume) IS NOT NULL AND MAX(volume) IS NOT NULL
        ORDER BY volume_change DESC
        LIMIT 1`,
    ),
  ]);

  const dashboardObj = {
    totalWorkouts: totalWorkoutsResult,
    totalWeeks: Number(totalWeeksResult[0]?.total_weeks ?? 0),
    mostLoggedExe,
    theMostWeight,
    mostVolumeChange,
  };

  res.json(toJsonSafe(dashboardObj));
});

export default router;
