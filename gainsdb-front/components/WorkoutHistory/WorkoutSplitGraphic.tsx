interface Props {
  exercises: [string, string][];
}

const CATEGORY_ORDER = [
  "upper-body",
  "lower-body",
  "core",
  "cardio",
  "other",
] as const;

const CATEGORY_LABELS: Record<(typeof CATEGORY_ORDER)[number], string> = {
  "upper-body": "Upper Body",
  "lower-body": "Lower Body",
  core: "Core",
  cardio: "Cardio",
  other: "Other",
};

export default function WorkoutSplitGraphic({ exercises }: Props) {
  const counts = CATEGORY_ORDER.reduce(
    (acc, category) => ({ ...acc, [category]: 0 }),
    {} as Record<(typeof CATEGORY_ORDER)[number], number>,
  );

  for (const [, category] of exercises) {
    if (category in counts) {
      counts[category as keyof typeof counts] += 1;
    }
  }

  const total = CATEGORY_ORDER.reduce(
    (sum, category) => sum + counts[category],
    0,
  );

  if (total === 0) {
    return null;
  }

  const splitSummary = CATEGORY_ORDER.filter((category) => counts[category] > 0)
    .map((category) => `${CATEGORY_LABELS[category]} ${counts[category]}`)
    .join(", ");

  return (
    <div className="workout-split-container" title={splitSummary}>
      <div
        className="workout-split-bar"
        role="img"
        aria-label={`Workout category split: ${splitSummary}`}
      >
        {CATEGORY_ORDER.map((category) => {
          const count = counts[category];
          if (count === 0) return null;

          const widthPercent = (count / total) * 100;
          return (
            <div
              key={category}
              className={`workout-split-segment ${category}`}
              style={{ width: `${widthPercent}%` }}
              title={`${CATEGORY_LABELS[category]}: ${count}`}
            />
          );
        })}
      </div>
    </div>
  );
}
