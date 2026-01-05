import { userRole } from "./user.response"


export interface getInvitationResponse {
    invitationData: {
        id: string,
        senderEmail: string,
        workspaceName: string,
        role: 'MEMBER' | 'ADMIN'
    }
}
