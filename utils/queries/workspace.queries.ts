import { useQuery } from "@tanstack/react-query"; 
import { workSpaceService } from "@/services/workspace.service";

export const useWorkspaceMembersQuery = (workspace_id: string) => {
    return useQuery({
        queryKey: ["getWorkspaceMembers", workspace_id],
        queryFn: () => workSpaceService.getWorkspaceMembers(workspace_id),
        staleTime: 5 * 60 * 1000, 
        enabled: !!workspace_id,
        retry: 3, 
        refetchOnWindowFocus: false
    });
}; 

