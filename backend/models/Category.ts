import { Schema, model } from "mongoose";
export interface ICategory {
    name: string;
    image: string | null;
    description: string | null;
}
const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: null,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
export const Category = model<ICategory>("Category", categorySchema);
