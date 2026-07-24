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
