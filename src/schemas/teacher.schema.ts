import { z } from "zod";

export const createTeacherSchema = z.object({
    fullName: z
        .string({ message: "Full name is required" })
        .trim()
        .min(2, { message: "Full name must be at least 2 characters" }),
    email: z
        .string({ message: "Email is required" })
        .trim()
        .email({ message: "Invalid email format" }),
    specialization: z
        .string({ message: "Specialization is required" })
        .trim()
        .min(2, { message: "Specialization must be at least 2 characters" }),
    experience: z
        .number({ message: "Experience is required" })
        .min(0, { message: "Experience cannot be negative" }),
});
