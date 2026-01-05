import { WORKSPACE_ROLE_ORDER, PROJECT_ROLE_ORDER } from "./guard"

type roles = keyof typeof WORKSPACE_ROLE_ORDER
type Proles = keyof typeof PROJECT_ROLE_ORDER


export const workspaceAccessRole = (minRole: roles, userRole: roles): Boolean => {
    let access = true;
    const reqMinRole = WORKSPACE_ROLE_ORDER[minRole];
    const roleUser = WORKSPACE_ROLE_ORDER[userRole]
    if (reqMinRole > roleUser) {
        access = false
    }
    return access
}

export const projectAccessRole = (minRole: Proles,userRole: Proles): Boolean => {
    let access = true;
    const reqMinRole = PROJECT_ROLE_ORDER[minRole];
    const roleUser = PROJECT_ROLE_ORDER[userRole]
    if (reqMinRole > roleUser) {
        access = false
    }
    return access
}