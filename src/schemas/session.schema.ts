import { z } from "zod";

export const createSessionSchema = z.object({
    teacherId: z
        .string({ message: "Teacher ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId for teacherId" }),
    startTime: z
        .string({ message: "Start time is required" })
        .datetime({ message: "startTime must be a valid ISO 8601 date string" }),
    endTime: z
        .string({ message: "End time is required" })
        .datetime({ message: "endTime must be a valid ISO 8601 date string" }),
}).refine(data => new Date(data.endTime).getTime() > new Date(data.startTime).getTime(), {
    message: "endTime must be strictly greater than startTime",
    path: ["endTime"]
});

export const bookSessionSchema = z.object({
    userId: z
        .string({ message: "User ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId for userId" }),
});
