import { User } from "@/types";
import api from "../axios";

export const getProjectsMembers = async (
  projectId: number,
): Promise<User[]> => {
  const response = await api.get(`/projects/${projectId}/members`);
  return response.data.map((m: { member: User }) => m.member);
};

export const addProjectMember = async (
  projectId: number,
  userId: number,
): Promise<void> => {
  await api.post(`/projects/${projectId}/members`, { userId });
};

export const removeProjectMember = async (
  projectId: number,
  userId: number,
): Promise<void> => {
  await api.delete(`/projects/${projectId}/members`, { data: { id: userId } });
};

export const getProjectMemberCandidates = async (
  projectId: number,
): Promise<User[]> => {
  const response = await api.get(
    `/projects/${projectId}/members/available-users`,
  );
  return response.data;
};
