import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export type IUser = InferSchemaType<typeof userSchema>;

export const User = model<IUser>("User", userSchema);