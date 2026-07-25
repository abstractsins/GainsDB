import {
  ContentTypeAppJson,
  FetchMethods,
  LoginRequestDTO,
  LoginResponse,
  RegistrationRequestDTO,
  RegistrationResponse,
} from "@/constants/fetchConstants";

import { Endpoints } from "@/constants/fetchConstants";

const server = process.env.NEXT_PUBLIC_BACKEND;

export const loginRequest = async (reqBody: LoginRequestDTO) => {
  try {
    const res = await fetch(`${server}/${Endpoints.Login}`, {
      method: FetchMethods.POST,
      headers: ContentTypeAppJson,
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const user: LoginResponse = await res.json();

    if (!user || !user.id || !user.username || !user.token) {
      throw new Error("Invalid user response from backend");
    }

    return {
      id: String(user.id),
      username: user.username,
      email: null,
      image: null,
      authToken: user.token,
    };
  } catch (error) {
    console.error("🔴 Authentication Error:", error);
    return null;
  }
};

export const registrationRequest = async (reqBody: RegistrationRequestDTO) => {
  try {
    const res = await fetch(`${server}/${Endpoints.Register}`, {
      method: FetchMethods.POST,
      headers: ContentTypeAppJson,
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
    }

    const response: RegistrationResponse = await res.json();

    if (!response) {
      throw new Error("Invalid user response from backend");
    }

    return response;
  } catch (error) {
    console.error("🔴 Registration Error:", error);
    return null;
  }
};
