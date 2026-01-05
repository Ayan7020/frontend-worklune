import z from "zod";

export const LoginUserSchema = z.object({
    email: z.email(),
    password: z.string().min(6,"Password length is too short"),
    rememberMe: z.boolean()
})

export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;