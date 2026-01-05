import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";

export const useFetchProjectsQuery = (workspace_id: string) => {
    return useQuery({
        queryKey: ["getProjects", workspace_id],
        queryFn: () => projectService.getProjects(workspace_id),
        staleTime: 5 * 60 * 1000,
        enabled: !!workspace_id,
        retry: 3,
        refetchOnWindowFocus: false,
    });
};

export const useFetchProjectDetailsQuery = (workspaceId: string,projectId: string) => {
    return useQuery({
        queryKey: ["getProjectDetails", projectId],
        queryFn: () => projectService.getProjectsDetails(workspaceId,projectId),
        staleTime: 5 * 60 * 1000,
        enabled: !!workspaceId && !!projectId,
        retry: 3,
        refetchOnWindowFocus: false,
    });
}