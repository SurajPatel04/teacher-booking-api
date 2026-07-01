import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z
        .string({ message: "Full name is required" })
        .trim()
        .min(2, { message: "Full name must be at least 2 characters" }),
    email: z
        .string({ message: "Email is required" })
        .trim()
        .email({ message: "Invalid email format" }),
    phone: z
        .string({ message: "Phone is required" })
        .trim()
        .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
});
