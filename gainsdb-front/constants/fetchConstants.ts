export enum FetchMethods {
  GET = "GET",
  POST = "POST",
}

export const ContentTypeAppJson = {
  "Content-Type": "application/json",
};

export interface LoginResponse {
  id: number;
  username: string;
  token: string;
}

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export enum Endpoints {
  VerifyToken = "api/verify-token",
}
