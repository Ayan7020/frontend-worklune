import { create } from "zustand"
import { UserDataResponse, workspaceData } from "@/utils/interfaces/responses/user.response"

interface WorkspaceStore {
    userStoreData: UserDataResponse | null;
    currentWorkspace: workspaceData | null;
    setUserData: (data: UserDataResponse) => void;
    setCurrentWorkspace: (data: workspaceData) => void;
    clearUserData: () => void;
}


export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
    userStoreData: null,
    currentWorkspace: null,
    setUserData: (data) => set({ userStoreData: data }),
    setCurrentWorkspace: (data) => set({ currentWorkspace: data }),
    clearUserData: () => set({ userStoreData: null }),
}))
