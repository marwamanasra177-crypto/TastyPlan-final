import { Schema, model, Types } from "mongoose";
export interface IMealPlan {
    user: Types.ObjectId;
    day: string;
    meal: Types.ObjectId;
    createdAt: Date;
}
const mealPlanSchema = new Schema<IMealPlan>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        day: {
            type: String,
            required: true,
        },
        meal: {
            type: Schema.Types.ObjectId,
            ref: "Meal",
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
export const MealPlan = model<IMealPlan>("MealPlan", mealPlanSchema);
