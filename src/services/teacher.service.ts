import { z } from "zod";
import { createTeacherSchema } from "../schemas/teacher.schema.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/apiError.utils.js";

type CreateTeacherInput = z.infer<typeof createTeacherSchema>;

export const createTeacherService = async (payload: CreateTeacherInput) => {
    const existingTeacher = await Teacher.findOne({ email: payload.email });

    if (existingTeacher) {
        throw new ApiError(409, "Teacher with this email already exists");
    }

    const teacher = await Teacher.create(payload);

    return teacher;
};
