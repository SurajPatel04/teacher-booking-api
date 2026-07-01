import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const teacherSchema = new Schema(
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
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export type ITeacher = InferSchemaType<typeof teacherSchema>;
export type TeacherDocument = HydratedDocument<ITeacher>;
export const Teacher = model<ITeacher>("Teacher", teacherSchema);
