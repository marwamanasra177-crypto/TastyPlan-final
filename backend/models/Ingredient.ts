import { Schema, model } from "mongoose";
export interface IIngredient {
    name: string;
}
const ingredientSchema = new Schema<IIngredient>(
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
export const Ingredient = model<IIngredient>("Ingredient", ingredientSchema);
