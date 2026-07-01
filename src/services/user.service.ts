import mongoose from "mongoose";
import { z } from "zod";
import { createUserSchema } from "../schemas/user.schema.js";
import { User } from "../models/user.model.js";
import { Session, SessionStatus } from "../models/session.model.js";
import { ApiError } from "../utils/apiError.utils.js";

type CreateUserInput = z.infer<typeof createUserSchema>;

export const createUserService = async (payload: CreateUserInput) => {
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create(payload);

    return user;
};

export const getUserSessionsService = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID format");
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(objectId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const pipeline = [
        {
            $match: {
                userId: objectId
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
        {
            $unwind: "$teacherInfo"
        },
        {
            $sort: { startTime: 1 as const }
        },
        {
            $facet: {
                upcomingSessions: [
                    { $match: { status: SessionStatus.BOOKED } },
                    {
                        $project: {
                            _id: 1,
                            startTime: 1,
                            endTime: 1,
                            status: 1,
                            completedAt: 1,
                            "teacher.id": "$teacherInfo._id",
                            "teacher.fullName": "$teacherInfo.fullName",
                            "teacher.specialization": "$teacherInfo.specialization"
                        }
                    }
                ],
                completedSessions: [
                    { $match: { status: SessionStatus.COMPLETED } },
                    {
                        $project: {
                            _id: 1,
                            startTime: 1,
                            endTime: 1,
                            status: 1,
                            completedAt: 1,
                            "teacher.id": "$teacherInfo._id",
                            "teacher.fullName": "$teacherInfo.fullName",
                            "teacher.specialization": "$teacherInfo.specialization"
                        }
                    }
                ]
            }
        }
    ];

    const result = await Session.aggregate(pipeline);

    return (
        result[0] ?? {
            upcomingSessions: [],
            completedSessions: [],
        }
    );
};
