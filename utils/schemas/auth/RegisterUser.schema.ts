import z from "zod";

export const RegisterUserSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Full name must be at least 2 characters' })
        .max(80, { message: 'Full name must be at most 80 characters' }),
    email: z
        .email({ message: 'Please enter a valid email address' }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .regex(/^\S*$/, "Password must not contain spaces"),
    confirmPassword: z
        .string()
        .min(1, { message: 'Please confirm your password' }),
    agreeToTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: 'You must agree to the terms and conditions',
        }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;