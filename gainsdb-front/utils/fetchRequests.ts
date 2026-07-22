import {
  ContentTypeAppJson,
  FetchMethods,
  LoginRequestDTO,
  LoginResponse,
} from "@/constants/fetchConstants";

const server = process.env.NEXT_PUBLIC_BACKEND;

export const loginRequest = async (reqBody: LoginRequestDTO) => {
  console.log("LOGIN REQUEST");
  try {
    const res = await fetch(`${server}/api/login`, {
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

    console.log(user);

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
