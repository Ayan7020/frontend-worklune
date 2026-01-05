import { request } from "@/lib/http/request";
import { WorkspaceMemberDataResponse } from "@/utils/interfaces/responses/workspace.response";
import { createWorkspaceForm } from "@/utils/schemas/dashboard/workspace.schema";

export const workSpaceService = {
    createWorkspace(data: createWorkspaceForm) {
        return request({
            method: "POST",
            url: "/dash/workspaces/create-workspace",
            data
        })
    },

    getWorkspaceMembers(workspace_id: string) {
        return request<WorkspaceMemberDataResponse>({
            method: "GET",
            url: `/dash/workspaces/get-workspace-member?workspaceId=${workspace_id}`, 
        })
    }
}