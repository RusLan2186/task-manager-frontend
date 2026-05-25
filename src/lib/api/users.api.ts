import api from "../axios";
import { User } from "@/types";



export const getUsers = async (search?: string): Promise<User[]> => {
  const response = await api.get("/users", {
    params: {
      search,
    },
  });
  return response.data;
};
