import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.utils.js";
import {
    createSessionService,
    getAvailableSessionsService,
    bookSessionService,
    completeSessionService
} from "../services/session.service.js";

export const createSession = asyncHandler(async (req: Request, res: Response) => {
    const session = await createSessionService(req.body);
    sendSuccess(res, 201, "Session created successfully", session);
});

export const getAvailableSessions = asyncHandler(async (req: Request, res: Response) => {
    const { dateTimestamp } = req.query;
    if (!dateTimestamp) {
        throw new ApiError(400, "dateTimestamp query parameter is required");
    }
    const sessions = await getAvailableSessionsService(dateTimestamp as string);
    sendSuccess(res, 200, "Available sessions fetched successfully", sessions);
});

export const bookSession = asyncHandler(async (req: Request, res: Response) => {
    const { id: sessionId } = req.params;
    const session = await bookSessionService(sessionId, req.body);
    sendSuccess(res, 200, "Session booked successfully", session);
});

export const completeSession = asyncHandler(async (req: Request, res: Response) => {
    const { id: sessionId } = req.params;
    const session = await completeSessionService(sessionId);
    sendSuccess(res, 200, "Session marked as complete", session);
});
