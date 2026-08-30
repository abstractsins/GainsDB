import NewWorkout from "@/app/user/new-workout/page";

export enum Environments {
  Prod = "production",
  Local = "local",
  Dev = "development",
}

export enum RouteSegment {
  Dashboard = "dashboard",
  User = "user",
  Profile = "profile",
  Exercises = "exercises",
  Charts = "charts",
  History = "history",
  NewWorkout = "new-workout",
  ComingSoon = "coming-soon",
  Settings = "settings",
  BodyWeight = "body-weight",
}

export enum InputTypes {
  Text = "text",
  Password = "password",
  Number = "number",
}

export const mobileMaxWidth = 768;

export enum AuthenticationStatus {
  Authenticated = "authenticated",
  Loading = "loading",
  Unauthenticated = "unauthenticated",
}

export enum ScreenSize {
  XXLarge = "xxLarge",
  Mobile = "mobile",
  Regular = "regular",
}

export const XXLargeScreenWidth = 1700;
export const MobileScreenWidth = 768;
