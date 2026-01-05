import { TaskStatus } from "@/utils/interfaces/responses/task.response";

export const statusBadgeStyles: Record<TaskStatus, string> = {
    TODO: 'bg-slate-100 text-slate-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    DONE: 'bg-emerald-100 text-emerald-700',
};