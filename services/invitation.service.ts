import { request } from "@/lib/http/request";
import { getInvitationResponse } from "@/utils/interfaces/responses/invitation.response";

interface InvitationData {
    sendTo: string,
    role: "ADMIN" | "MEMBER"
}

export interface updateInvitationInterface {
    id: string,
    action: "DECLINED" | "ACCEPTED"
}

export const InivitationService = {
    sendInivitation(workspace_id: string, data: InvitationData) {
        return request({
            method: "POST",
            url: `/dash/invitations/send-invitation?workspaceId=${workspace_id}`,
            data
        })
    },

    getInvitation() {
        return request<getInvitationResponse>({
            method: "GET",
            url: `/dash/invitations/get-invitation`,
        })
    },

    updateInvitation(data: updateInvitationInterface) {
        return request({
            method: "POST",
            url: `/dash/invitations/update-invitation`,
            data
        })
    }
}