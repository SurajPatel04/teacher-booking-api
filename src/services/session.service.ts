import mongoose from "mongoose";
import { z } from "zod";
import { createSessionSchema, bookSessionSchema } from "../schemas/session.schema.js";
import { Session, SessionStatus } from "../models/session.model.js";
import { Teacher } from "../models/teacher.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.utils.js";

type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const createSessionService = async (payload: CreateSessionInput) => {
    const { teacherId, startTime, endTime } = payload;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new ApiError(400, "Invalid teacher id");
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
        throw new ApiError(400, "endTime must be greater than startTime");
    }

    const teacherExists = await Teacher.exists({ _id: teacherId });
    if (!teacherExists) {
        throw new ApiError(404, "Teacher not found");
    }

    // Enhancement: Prevent overlapping sessions for the same teacher
    const overlappingSession = await Session.findOne({
        teacherId,
        startTime: { $lt: end },
        endTime: { $gt: start },
    });

    if (overlappingSession) {
        throw new ApiError(409, "Teacher already has a session scheduled during this time.");
    }

    const session = await Session.create({
        teacherId,
        startTime,
        endTime,
        status: SessionStatus.AVAILABLE,
    });
    return session;
};

export const getAvailableSessionsService = async (dateTimestamp: string) => {
    const date = new Date(Number(dateTimestamp));
    if (isNaN(date.getTime())) {
        throw new ApiError(400, "Invalid dateTimestamp provided");
    }

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const pipeline: mongoose.PipelineStage[] = [
        {
            $match: {
                status: SessionStatus.AVAILABLE,
                startTime: { $gte: startOfDay, $lte: endOfDay }
            }
        },
        {
            $lookup: {
                from: "teachers",
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherInfo"
            }
        },
        { $unwind: "$teacherInfo" },
        {
            $project: {
                _id: 1,
                startTime: 1,
                endTime: 1,
                status: 1,
                "teacher.id": "$teacherInfo._id",
                "teacher.fullName": "$teacherInfo.fullName",
                "teacher.specialization": "$teacherInfo.specialization"
            }
        },
        { $sort: { startTime: 1 as const } }
    ];

    return await Session.aggregate(pipeline);
};

type BookSessionInput = z.infer<typeof bookSessionSchema>;

export const bookSessionService = async (sessionId: string, payload: BookSessionInput) => {
    const { userId } = payload;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new ApiError(400, "Invalid session id");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    if (session.status !== SessionStatus.AVAILABLE) {
        throw new ApiError(400, "Only AVAILABLE sessions can be booked. This session is already booked or completed.");
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
        throw new ApiError(404, "User not found");
    }

    session.status = SessionStatus.BOOKED;
    session.userId = new mongoose.Types.ObjectId(userId);
    await session.save();

    return session;
};

export const completeSessionService = async (sessionId: string) => {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new ApiError(400, "Invalid session id");
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    if (session.status !== SessionStatus.BOOKED) {
        throw new ApiError(400, "Only BOOKED sessions can be marked as completed.");
    }

    session.status = SessionStatus.COMPLETED;
    session.completedAt = new Date();
    await session.save();

    return session;
};
