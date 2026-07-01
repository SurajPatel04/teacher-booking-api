import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { createTeacherService } from "../services/teacher.service.js";

export const createTeacher = asyncHandler(
    async (req: Request, res: Response) => {
        const teacher = await createTeacherService(req.body);

        sendSuccess(res, 201, "Teacher created successfully", teacher);
    }
);