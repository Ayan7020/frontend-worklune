import { taksViewData } from "./task.response";


export const PROJECT_COLORS = {
  ORANGE: '#E86C3A',
  BLUE: '#4B8BF5',
  GREEN: '#22C55E',
  PURPLE: '#9333EA',
  YELLOW: '#EAB308',
  PINK: '#EC4899',
  CYAN: '#06B6D4',
  ORANGE_DARK: '#F97316',
} as const

export type ProjectColor = keyof typeof PROJECT_COLORS

export interface ProjectMembers {
    id: string;
    name: string;
    avatarUrl: string;
    email: string;
    role: "OWNER" | "MAINTAINER" | "MEMBER"
}

export interface ProjectData {
    id: string;
    name: string;
    description: string;
    color: ProjectColor,
    status: "ACTIVE" | "COMPLETED"
    createdBy: string;
    createdAt: string;
    projectMembers: ProjectMembers[];
    projectMemberCount: number;
    taskCount: number;
    completedTaskCount: number;
}



export interface getProjectResponse {
    projectsDataRefine: ProjectData[]
}

export interface TaskWithProject extends ProjectData {
    taskData: taksViewData
}

export interface getProjectsDetailsInterface  {
    projectsDetails: TaskWithProject
}
