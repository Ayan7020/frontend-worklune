import { request } from "@/lib/http/request";
import { getTaskDetailsResponse, getTasksResponse } from "@/utils/interfaces/responses/task.response";
import { createTaskInput, createTaskOutput, createTasksSchema } from "@/utils/schemas/dashboard/task.schema";


export const taskService = {
    getTask(workspaceId: string) {
        return request<getTasksResponse>({
            method: "GET",
            url: `/dash/tasks/get-task?workspaceId=${workspaceId}`,
        })
    },

    getTaskDetails(workspaceId: string, projectId: string,taskId: string) {
        return request<getTaskDetailsResponse>({
            method: "GET",
            url: `/dash/tasks/get-taskDetails?workspaceId=${workspaceId}&projectId=${projectId}&taskId=${taskId}`,
        })
    },
    createTask(workspaceId: string, data: createTaskInput | createTaskOutput) {
        // Validate the data with the schema
        const validatedData = createTasksSchema.parse(data);
        return request({
            method: "POST",
            url: `/dash/tasks/create-task?workspaceId=${workspaceId}`,
            data: validatedData
        })
    },

}