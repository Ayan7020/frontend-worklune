import { PROJECT_COLORS } from "@/utils/interfaces/responses/project.response";
import z from "zod";


export const createProjectSchema = z.object({
    name: z.string().min(3, "name is too short"),
    description: z.string().min(10, "Description is too short").max(255, "Description is too long"),
    projectColor: z.enum(Object.keys(PROJECT_COLORS) as [keyof typeof PROJECT_COLORS])
});


export const addMemberSchema = z.object({
    member_id: z.uuid(),
    project_id: z.uuid(),
    role: z.enum(['MAINTAINER', 'MEMBER'])
});

export const updateMemberRoleSchema = z.object({
    member_id: z.uuid(),
    project_id: z.uuid(),
    role: z.enum(['MAINTAINER', 'MEMBER'])
});

export const removeMemberSchema = z.object({
    member_id: z.uuid(),
    project_id: z.uuid()
});

export const changeProjectMemberOwnerShipSchema = z.object({
    member_id: z.uuid(),
    project_id: z.uuid(), 
})


export type createProjectForm = z.infer<typeof createProjectSchema>;
export type addMemberForm = z.infer<typeof addMemberSchema>;
export type updateMemberRoleForm = z.infer<typeof updateMemberRoleSchema>;
export type removeMemberForm = z.infer<typeof removeMemberSchema>;
export type changeProjectMemberOwnerShipSchemaForm = z.infer<typeof changeProjectMemberOwnerShipSchema>;
