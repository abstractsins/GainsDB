import { ContentTypeAppJson, FetchMethods } from "@/constants/fetchConstants";

const server = process.env.NEXT_PUBLIC_BACKEND;

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export const loginRequest = async (reqBody: LoginRequestDTO) => {
  try {
    const res = await fetch(`${server}/api/login`, {
      method: FetchMethods.POST,
      headers: ContentTypeAppJson,
      body: JSON.stringify(reqBody),
    });
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};
