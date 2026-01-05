import { ProjectColor } from "./project.response";

export interface GenericUserResponse {
    id: string
    name: string
    email: string
    avatarUrl: string
}

export interface taskDescussionsData {
    id: string,
    content: string,
    createdAt: string,
    user: GenericUserResponse,
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";


export interface taksViewData {
    id: string
    title: string,
    description: string,
    tag: string,
    priority: "URGENT" | "HIGH" | "LOW",
    status: TaskStatus,
    assigneeId: string,
    createdById: string
}

export interface taksViewDataV2 {
    id: string
    title: string,
    description: string,
    tag: string,
    priority: "URGENT" | "HIGH" | "LOW",
    status: "TODO" | "IN_PROGRESS" | "DONE",
    assignuser: GenericUserResponse,
    user: GenericUserResponse
    taskDescussions: taskDescussionsData[]
}

export interface taksData {
    projectId: string;
    name: string;
    userRole: "MEMBER" | "MAINTAINER" | "OWNER";
    color: ProjectColor
    tasks: taksViewData[]
}

export interface getTasksResponse {
    taksData: taksData[]
}

export interface getTaskDetailsResponse {
    taskDetails: taksViewDataV2
}