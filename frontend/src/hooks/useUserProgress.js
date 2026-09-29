import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user";

export const useUserProgress = () => {
  return useQuery({
    queryKey: ["userProgress"],
    queryFn: userApi.getUserProgress,
    staleTime: 60000,
  });
};

export const useMarkProblemSolved = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.markProblemSolved,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    },
  });
};
