export enum Environments {
  Prod = "production",
  Local = "local",
  Dev = "development",
}

export enum Routes {
  Dashboard = "dashboard",
  User = "user",
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
