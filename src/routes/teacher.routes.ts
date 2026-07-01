import { Router } from "express";
import { createTeacher } from "../controllers/teacher.controller.js"; 
import { validate } from "../middlewares/validate.middleware.js";
import { createTeacherSchema } from "../schemas/teacher.schema.js";

const router = Router();

router.post("/", validate(createTeacherSchema), createTeacher);

export default router;
