import { User } from "@/types";
import api from "../axios";

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const verifyEmail = async (
  email: string,
  code: string,
): Promise<void> => {
  await api.post("/auth/verify-email", { email, code });
};
