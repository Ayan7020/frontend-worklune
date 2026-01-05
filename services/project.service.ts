import { request } from "@/lib/http/request";
import { getInvitationResponse } from "@/utils/interfaces/responses/invitation.response";
import { getProjectResponse, getProjectsDetailsInterface } from "@/utils/interfaces/responses/project.response";
import { createProjectForm, addMemberForm, changeProjectMemberOwnerShipSchemaForm, updateMemberRoleForm, removeMemberForm } from "@/utils/schemas/dashboard/projects.schema";


export const projectService = {
    getProjects(workspace_id: string) {
        return request<getProjectResponse>({
            method: "GET",
            url: `/dash/projects/get-project?workspaceId=${workspace_id}`,
        })
    },
    
    getProjectsDetails(workspaceId: string,projectId: string) {
        return request<getProjectsDetailsInterface>({
            method: "GET",
            url: `/dash/projects/get-project-details?workspaceId=${workspaceId}&projectId=${projectId}`,
        })
    },

    createProject(workspace_id: string, data: createProjectForm) {
        return request({
            method: "POST",
            url: `/dash/projects/create-project?workspaceId=${workspace_id}`,
            data
        })
    },

    addMember(workspaceId: string, data: addMemberForm) {
        return request({
            method: "POST",
            url: `/dash/projects/members/add-member?workspaceId=${workspaceId}`,
            data
        })
    },

    updateMemberRole(workspaceId: string, data: updateMemberRoleForm) {
        return request({
            method: "POST",
            url: `/dash/projects/members/change-role?workspaceId=${workspaceId}`,
            data
        })
    },

    removeMember(workspaceId: string, data: removeMemberForm) {
        return request({
            method: "POST",
            url: `/dash/projects/members/remove-member?workspaceId=${workspaceId}`,
            data
        })
    },

    transferOwnership(workspaceId: string, data: changeProjectMemberOwnerShipSchemaForm) {
        return request({
            method: "POST",
            url: `/dash/projects/members/change-project-ownership?workspaceId=${workspaceId}`,
            data
        })
    }

}