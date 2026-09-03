import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: {
            virtuals: true,
            transform: (_doc: any, ret: any) => {
                delete ret.password;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

export const User = model<IUser>("User", userSchema);
