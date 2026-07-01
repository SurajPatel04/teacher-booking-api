import { Router } from "express";
import {
    createSession,
    getAvailableSessions,
    bookSession,
    completeSession
} from "../controllers/session.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSessionSchema, bookSessionSchema } from "../schemas/session.schema.js";

const router = Router();

router.post("/", validate(createSessionSchema), createSession);
router.get("/available", getAvailableSessions);
router.post("/:id/book", validate(bookSessionSchema), bookSession);
router.patch("/:id/complete", completeSession);

export default router;
