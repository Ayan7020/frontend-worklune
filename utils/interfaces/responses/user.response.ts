export type userRole = "OWNER" | "ADMIN" | "MEMBER";

export interface workspaceData {
    workspaceId: string;
    workspaceName: string;
    role: userRole;
}

export interface UserDataResponse {
    userData: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
        emailVerified: string;
        defaultWorkspaceId: string;
    };
    workspaceData: workspaceData[];
}



export interface usersResponse {
    users: {
        id: string;
        name: string,
        email: string,
        avatarUrl: string | null
    }[]
}
