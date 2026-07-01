import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { createUserService, getUserSessionsService } from "../services/user.service.js";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await createUserService(req.body);

    sendSuccess(res, 201, "User created successfully", user);
});

export const getUserSessions = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = req.params;

    const sessions = await getUserSessionsService(userId);

    sendSuccess(res, 200, "User sessions fetched successfully", sessions);
});