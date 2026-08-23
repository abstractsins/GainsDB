export const GenericError = {
  Server: "There was an error with the request. Try again later.",
  Unknown: "An unknown error occured. Consult system logs.",
} as const;

export const LoginError = {
  ...GenericError,
  InvalidCredentials: "Invalid credentials. Please try again.",
} as const;

export const RegistrationError = {
  ...GenericError,
  NameTaken: "That username is taken. Try another one.",
} as const;

export const ExerciseError = {
  ...GenericError,
  NoWorkoutDataForExercise: "No workout data exists for this exercise",
};
