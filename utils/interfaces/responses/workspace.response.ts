import { userRole } from "./user.response"


export interface WorkspaceMemberDataResponse {
    membersData: {
        id: string;
        name: string
        role: userRole,
        avatarUrl: string,
        joinedAt: Date, 
        email: string,
        taskCount: number,
        projectCount: number
    }[], 
}