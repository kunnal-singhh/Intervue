import axiosInstance from "../lib/axios";

export const userApi = {
  getUserProgress: async () => {
    const response = await axiosInstance.get("/user/progress");
    return response.data;
  },
  getUserStats: async () => {
    const response = await axiosInstance.get("/user/stats");
    return response.data;
  },
  markProblemSolved: async ({ problemId, language }) => {
    const response = await axiosInstance.post(`/user/solve/${problemId}`, { language });
    return response.data;
  },
  toggleStarProblem: async (problemId) => {
    const response = await axiosInstance.post(`/user/star/${problemId}`);
    return response.data;
  },
};
