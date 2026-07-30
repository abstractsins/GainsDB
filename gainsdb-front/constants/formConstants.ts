import { FormState } from "@/components/LoginRegister";

export interface CredentialsFormData {
  username: string;
  password: string;
  passwordConfirm?: string;
}

export const blankCredentials = {
  username: "",
  password: "",
};

export const charMax = {
  username: 15,
};

export const charMin = {
  username: 3,
};

//* utility for loading the placeholder/label/etc strings into an object for easy referencing inline
export const cacheLoginRegisterFormStrings = (
  formState: FormState,
): Record<string, string> => {
  const loginStrings = {
    placeholderUsername: "Username",
    placeholderPassword: "Password",
  };

  const registerStrings = {
    placeholderUsername: "Create username",
    placeholderPassword: "Create password",
    placeholderConfirmPassword: "Confirm password",
  };

  if (formState === FormState.Login) {
    return loginStrings;
  } else if (formState === FormState.Register) {
    return registerStrings;
  }

  return {};
};
