import z  from "zod";

export const createTasksSchema = z.object({
    project_id: z.string(), 
    task_title: z.string(),
    task_priority: z.enum(['URGENT','HIGH','LOW']), 
    task_description: z.string(),
    task_due_date: z.coerce.date(),
    task_tag: z.string(),
    user_assign_id: z.string() 
}) 

export type createTasksForm = z.infer<typeof createTasksSchema>;

export type createTaskInput = z.input<typeof createTasksSchema>
export type createTaskOutput = z.output<typeof createTasksSchema>
