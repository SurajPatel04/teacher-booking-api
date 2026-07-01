import { Router } from "express";
import { createUser, getUserSessions } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/", validate(createUserSchema), createUser);

router.get("/:id/sessions", getUserSessions);

export default router;
