import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { User } from "../models/user.model.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    // The validate middleware handles missing/invalid fields before we reach this point!
    const { fullName, email, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        fullName,
        email,
        phone,
    });

    sendSuccess(res, 201, "User created successfully", user);
});