import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";

export const useFetchTasksQuery = (workspace_id: string) => {
    return useQuery({
        queryKey: ["getTasks1", workspace_id],
        queryFn: () => taskService.getTask(workspace_id), 
        enabled: !!workspace_id, 
    });
};

export const useFetchTasksDetailsQuery = (workspaceId: string, projectId: string, taskId: string) => {
    return useQuery({
        queryKey: ["getTasksDetails", workspaceId, projectId, taskId],
        queryFn: () => taskService.getTaskDetails(workspaceId, projectId, taskId), 
        enabled: !!workspaceId && !!projectId && !!taskId, 
    });
}; 