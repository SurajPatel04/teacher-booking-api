import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z
        .string({ required_error: "Full name is required" })
        .trim()
        .min(2, "Full name must be at least 2 characters"),
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format"),
    phone: z
        .string({ required_error: "Phone is required" })
        .trim()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});
