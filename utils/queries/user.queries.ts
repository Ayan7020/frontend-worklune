import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useDebounce } from "../common/useDebounce";

interface UseUserSearchParams { 
  query: string;
}

export const useUserDataQuery = () => {
  return useQuery({
    queryKey: ["getUserData"],
    queryFn: userService.getUserData,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false
  });
};
 

export function useUserSearch({  query }: UseUserSearchParams) {
  const debouncedQuery = useDebounce(query, 350);

  return useQuery({
    queryKey: ["users-search", debouncedQuery],
    queryFn: ({ signal }) =>
      userService.searchUsers({ 
        query: debouncedQuery,
        signal,
      }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}


