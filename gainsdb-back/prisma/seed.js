import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPkg from "@prisma/client";

const { Prisma, PrismaClient } = prismaClientPkg;

const appendOnly = process.env.SEED_APPEND_ONLY !== "false";
const seedMonthsBack = Number.parseInt(process.env.SEED_MONTHS_BACK ?? "10", 10);
const sessionsPerWeek = Number.parseInt(
  process.env.SEED_SESSIONS_PER_WEEK ?? "3",
  10,
);
const targetUsersRaw = process.env.SEED_TARGET_USERS ?? "demo,power_user";
const targetUsernames = targetUsersRaw
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for Prisma seed");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_SEED_USER_PROFILES = [
  {
    username: "demo",
    custom_name: "Demo User",
    created_on: new Date("2026-01-01"),
    preferences: { unit: "lbs", theme: "light" },
  },
  {
    username: "power_user",
    custom_name: "Power User",
    created_on: new Date("2026-02-01"),
    preferences: { unit: "lbs", theme: "light" },
  },
];

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
  const selectedProfiles = DEFAULT_SEED_USER_PROFILES.filter((profile) =>
    targetUsernames.includes(profile.username),
  );

  const seededUsers = [];

  for (const profile of selectedProfiles) {
    const user = await prisma.users.upsert({
      where: { username: profile.username },
      update: {},
      create: {
        username: profile.username,
        password: demoPasswordHash,
        custom_name: profile.custom_name,
        created_on: profile.created_on,
        preferences: profile.preferences,
      },
    });

    seededUsers.push(user);
  }

  const customUsernames = targetUsernames.filter(
    (username) =>
      !DEFAULT_SEED_USER_PROFILES.some((profile) => profile.username === username),
  );

  for (const username of customUsernames) {
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      seededUsers.push(existingUser);
    } else {
      console.warn(`Skipping unknown user '${username}' (not found).`);
    }
  }

  return { seededUsers, seedPassword };
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

function getSeedWindow(monthsBack) {
  // End at yesterday (local) so seed data never includes today/tomorrow.
  const endDate = addDaysLocal(startOfLocalDay(new Date()), -1);
  const januaryFirst = new Date(endDate.getFullYear(), 0, 1);

  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - Math.max(monthsBack, 0));
  startDate.setDate(startDate.getDate() + 1);

  if (startDate < januaryFirst) {
    return { startDate: januaryFirst, endDate };
  }

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
  startDate,
  endDate,
  startOffsetDays = 0,
) {
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

function getTrainingDays(perWeek) {
  const normalized = Math.min(Math.max(perWeek, 1), 7);
  const dayMap = {
    1: [3],
    2: [2, 5],
    3: [1, 3, 5],
    4: [1, 2, 4, 6],
    5: [1, 2, 3, 5, 6],
    6: [1, 2, 3, 4, 5, 6],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  return dayMap[normalized];
}

function shiftTrainingDays(days, shiftBy) {
  return days.map((day) => (day + shiftBy) % 7);
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
  const { seededUsers, seedPassword } = await upsertUsers();
  const exerciseIds = await ensureExercises();
  const { startDate, endDate } = getSeedWindow(seedMonthsBack);

  const createdByUser = [];
  const trainingDays = getTrainingDays(sessionsPerWeek);

  for (let i = 0; i < seededUsers.length; i += 1) {
    const user = seededUsers[i];

    await ensureUserExercises(user.id, exerciseIds);

    if (!appendOnly) {
      await removeFutureWorkouts(user.id, endDate);
      await resetSeedWindowWorkouts(user.id, startDate, endDate);
    }

    const createdCount = await seedWorkoutsForUser(
      user.id,
      exerciseIds,
      shiftTrainingDays(trainingDays, i),
      startDate,
      endDate,
      i % 2,
    );

    await normalizeUserWeightsToWholeNumbers(user.id);

    createdByUser.push({ username: user.username, createdCount });
  }

  console.log("Seed complete:");
  console.log(`- Users seeded: ${seededUsers.map((user) => user.username).join(", ")}`);
  console.log(`- Demo-style seed password: ${seedPassword}`);
  console.log(`- Mode: ${appendOnly ? "append-only" : "reset-window"}`);
  console.log(`- Window: ${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)}`);
  console.log(`- Sessions/week target: ${sessionsPerWeek}`);
  console.log(`- Exercises: ${EXERCISE_NAMES.length}`);
  createdByUser.forEach((entry) => {
    console.log(`- Workouts created for ${entry.username}: ${entry.createdCount}`);
  });
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
