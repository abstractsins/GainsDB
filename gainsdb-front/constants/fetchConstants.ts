export enum FetchMethods {
  GET = "GET",
  POST = "POST",
}

export const ContentTypeAppJson = {
  "Content-Type": "application/json",
};

export interface SimpleUser {
  id: number;
  username: string;
}

export interface SimpleCredentials {
  username: string;
  password: string;
}

export interface LoginResponse extends SimpleUser {
  token: string;
}

export interface LoginRequestDTO extends SimpleCredentials {}

const api = "api";

export enum Endpoints {
  VerifyToken = api + "/verify-token",
  Login = api + "/login",
  Register = api + "/register",
}

export interface RegistrationRequestDTO extends LoginRequestDTO {
  date: Date;
}

export interface RegistrationResponse {
  status: number;
  error?: string;
  message?: string;
  user?: SimpleUser;
}
