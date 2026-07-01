import { Schema, model, InferSchemaType, HydratedDocument, Types } from "mongoose";

export enum SessionStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
  COMPLETED = "COMPLETED",
}

const sessionSchema = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.AVAILABLE,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type ISession = InferSchemaType<typeof sessionSchema>;
export type SessionDocument = HydratedDocument<ISession>;
export const Session = model<ISession>("Session", sessionSchema);
