import { Schema, model } from "mongoose";

export interface IArea {
    name: string;
}

const areaSchema = new Schema<IArea>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Area = model<IArea>("Area", areaSchema);
