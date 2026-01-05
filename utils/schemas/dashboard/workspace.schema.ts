import z from "zod";

export const createWorkspaceSchema = z.object({
    workspaceName: z.string().trim().min(1, 'Workspace name is required'),
});

export type createWorkspaceForm = z.infer<typeof createWorkspaceSchema>;