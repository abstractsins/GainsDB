import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for Prisma seed");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const EXERCISE_NAMES = [
  "Diverging Seated Row",
  "Converging Shoulder Press",
  "Seated Calf Raises",
  "Inner Thigh",
  "Outer Thigh",
  "Leg Extensions",
  "Bicep Curl",
  "Tricep Extension",
  "Ab Coaster",
  "Rotary Torso",
];

async function upsertUsers() {
  const seedPassword = process.env.SEED_DEMO_PASSWORD || "password123";
  const demoPasswordHash = await bcrypt.hash(seedPassword, 10);

  const demoUser = await prisma.users.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      password: demoPasswordHash,
      custom_name: "Demo User",
      created_on: new Date("2026-01-01"),
      preferences: { unit: "lbs", theme: "light" },
    },
  });

  const powerUser = await prisma.users.upsert({
    where: { username: "power_user" },
    update: {},
    create: {
      username: "power_user",
      password: demoPasswordHash,
      custom_name: "Power User",
      created_on: new Date("2026-02-01"),
      preferences: { unit: "lbs", theme: "light" },
    },
  });

  return { demoUser, powerUser, seedPassword };
}

async function ensureExercises() {
  await prisma.exercises.createMany({
    data: EXERCISE_NAMES.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const exercises = await prisma.exercises.findMany({
    where: { name: { in: EXERCISE_NAMES } },
  });

  return new Map(exercises.map((exercise) => [exercise.name, exercise.id]));
}

async function ensureUserExercises(userId, exerciseIds) {
  await prisma.user_exercises.createMany({
    data: Array.from(exerciseIds.values()).map((exerciseId) => ({
      user_id: userId,
      exercise_id: exerciseId,
    })),
    skipDuplicates: true,
  });
}

async function ensureWorkout(userId, workoutDate, blocks) {
  const existingWorkout = await prisma.workouts.findFirst({
    where: {
      user_id: userId,
      workout_date: workoutDate,
    },
    select: { id: true },
  });

  if (existingWorkout) {
    return { created: false };
  }

  await prisma.workouts.create({
    data: {
      user_id: userId,
      workout_date: workoutDate,
      workout_exercises: {
        create: blocks.map((block) => ({
          exercise_id: block.exerciseId,
          sets: {
            create: block.sets.map((set, index) => ({
              weight: set.weight,
              reps: set.reps,
              set_order: index + 1,
            })),
          },
        })),
      },
    },
  });

  return { created: true };
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDaysLocal(date, daysToAdd) {
  const next = new Date(date);
  next.setDate(next.getDate() + daysToAdd);
  return next;
}

function getSixMonthWindow() {
  // End at yesterday (local) so seed data never includes today/tomorrow.
  const endDate = addDaysLocal(startOfLocalDay(new Date()), -1);
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 6);
  startDate.setDate(startDate.getDate() + 1);
  return { startDate, endDate };
}

function toWeightString(weight) {
  return String(Math.round(weight));
}

function createSets(baseWeight, weekIndex, exerciseIndex) {
  const progression = weekIndex * 2;
  const variation = (exerciseIndex % 3) * 5;
  const topWeight = baseWeight + progression + variation;

  return [
    { weight: toWeightString(topWeight - 10), reps: 12 },
    { weight: toWeightString(topWeight - 5), reps: 10 },
    { weight: toWeightString(topWeight), reps: 8 },
  ];
}

function buildWorkoutBlocks(exerciseIds, sessionIndex, weekIndex) {
  const exercisesPerWorkout = 4;
  const startIndex = (sessionIndex * 2) % EXERCISE_NAMES.length;

  return Array.from({ length: exercisesPerWorkout }).map((_, offset) => {
    const exerciseName =
      EXERCISE_NAMES[(startIndex + offset) % EXERCISE_NAMES.length];
    const exerciseId = exerciseIds.get(exerciseName);
    const baseWeight =
      40 + ((startIndex + offset) % EXERCISE_NAMES.length) * 10;

    return {
      exerciseId,
      sets: createSets(baseWeight, weekIndex, startIndex + offset),
    };
  });
}

async function seedWorkoutsForUser(
  userId,
  exerciseIds,
  trainingDays,
  startOffsetDays = 0,
) {
  const { startDate, endDate } = getSixMonthWindow();
  let cursor = addDaysLocal(startDate, startOffsetDays);
  let sessionIndex = 0;
  let createdCount = 0;

  while (cursor <= endDate) {
    const day = cursor.getDay();

    if (trainingDays.includes(day)) {
      const weekIndex = Math.floor(sessionIndex / trainingDays.length);
      const blocks = buildWorkoutBlocks(exerciseIds, sessionIndex, weekIndex);

      const result = await ensureWorkout(userId, cursor, blocks);
      if (result.created) {
        createdCount += 1;
      }

      sessionIndex += 1;
    }

    cursor = addDaysLocal(cursor, 1);
  }

  return createdCount;
}

async function removeFutureWorkouts(userId, endDate) {
  await prisma.workouts.deleteMany({
    where: {
      user_id: userId,
      workout_date: {
        gt: endDate,
      },
    },
  });
}

async function resetSeedWindowWorkouts(userId, startDate, endDate) {
  await prisma.workouts.deleteMany({
    where: {
      user_id: userId,
      workout_date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

async function normalizeUserWeightsToWholeNumbers(userId) {
  await prisma.$executeRaw(
    Prisma.sql`UPDATE sets s
               SET weight = ROUND(s.weight, 0)
               FROM workout_exercises we
               JOIN workouts w ON we.workout_id = w.id
               WHERE s.workout_exercise_id = we.id
                 AND w.user_id = ${userId}`,
  );
}

async function seed() {
  const { demoUser, powerUser, seedPassword } = await upsertUsers();
  const exerciseIds = await ensureExercises();
  const { startDate, endDate } = getSixMonthWindow();

  await ensureUserExercises(demoUser.id, exerciseIds);
  await ensureUserExercises(powerUser.id, exerciseIds);
  await removeFutureWorkouts(demoUser.id, endDate);
  await removeFutureWorkouts(powerUser.id, endDate);
  await resetSeedWindowWorkouts(demoUser.id, startDate, endDate);
  await resetSeedWindowWorkouts(powerUser.id, startDate, endDate);

  const demoCreated = await seedWorkoutsForUser(
    demoUser.id,
    exerciseIds,
    [1, 3, 5],
    0,
  );
  const powerCreated = await seedWorkoutsForUser(
    powerUser.id,
    exerciseIds,
    [2, 4],
    1,
  );

  await normalizeUserWeightsToWholeNumbers(demoUser.id);
  await normalizeUserWeightsToWholeNumbers(powerUser.id);

  console.log("Seed complete:");
  console.log(`- Users: demo, power_user (password: ${seedPassword})`);
  console.log(`- Exercises: ${EXERCISE_NAMES.length}`);
  console.log(`- Workouts created for demo: ${demoCreated}`);
  console.log(`- Workouts created for power_user: ${powerCreated}`);
  console.log("- All seeded workout weights normalized to whole integers");
}

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
