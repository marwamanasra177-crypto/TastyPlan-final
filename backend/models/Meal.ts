import { Schema, model, Types } from "mongoose";
export interface IMealIngredient {
    ingredient: Types.ObjectId;
    measure: string | null;
}
export interface IMeal {
    themealdbId: string;
    name: string;
    instructions: string | null;
    image: string | null;
    youtubeUrl: string | null;
    category: Types.ObjectId | null;
    area: Types.ObjectId | null;
    mealIngredients: IMealIngredient[];
}
const mealIngredientSchema = new Schema<IMealIngredient>(
    {
        ingredient: {
            type: Schema.Types.ObjectId,
            ref: "Ingredient",
            required: true,
        },
        measure: {
            type: String,
            default: null,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
const mealSchema = new Schema<IMeal>(
    {
        themealdbId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        instructions: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        youtubeUrl: {
            type: String,
            default: null,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        area: {
            type: Schema.Types.ObjectId,
            ref: "Area",
            default: null,
        },
        mealIngredients: {
            type: [mealIngredientSchema],
            default: [],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
export const Meal = model<IMeal>("Meal", mealSchema);
