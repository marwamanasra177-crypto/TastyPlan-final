import { Schema, model, Types } from "mongoose";
export interface IFavorite {
    user: Types.ObjectId;
    meal: Types.ObjectId;
    createdAt: Date;
}
const favoriteSchema = new Schema<IFavorite>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
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
// A user can only favorite a given meal once
favoriteSchema.index({ user: 1, meal: 1 }, { unique: true });
export const Favorite = model<IFavorite>("Favorite", favoriteSchema);
