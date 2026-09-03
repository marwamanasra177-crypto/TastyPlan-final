import { Router } from "express";
import { Favorite } from "../models/Favorite.js";
import { Meal } from "../models/Meal.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../middleware/auth.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Get my favorites
|--------------------------------------------------------------------------
*/

router.get("/", requireAuth, async (req: AuthedRequest, res) => {

    try {

        const favorites = await Favorite.find({
            user: req.userId,
        })
            .populate({
                path: "meal",
                populate: [
                    { path: "category" },
                    { path: "area" },
                ],
            })
            .sort({ createdAt: -1 });

        return res.json({
            meals: favorites.map((favorite) => favorite.meal),
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to load favorites",
        });
    }
});

/*
|--------------------------------------------------------------------------
| Add a favorite
|--------------------------------------------------------------------------
*/

router.post("/", requireAuth, async (req: AuthedRequest, res) => {

    try {

        const { mealId } = req.body;

        if (!mealId) {
            return res.status(400).json({
                message: "mealId is required",
            });
        }

        const meal = await Meal.findById(mealId);

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        const existing = await Favorite.findOne({
            user: req.userId,
            meal: meal._id,
        });

        if (existing) {
            return res.status(200).json({
                message: "Already in favorites",
            });
        }

        await Favorite.create({
            user: req.userId,
            meal: meal._id,
        });

        return res.status(201).json({
            message: "Added to favorites",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to add favorite",
        });
    }
});

/*
|--------------------------------------------------------------------------
| Remove a favorite
|--------------------------------------------------------------------------
*/

router.delete(
    "/:mealId",
    requireAuth,
    async (req: AuthedRequest, res) => {

        try {

            await Favorite.deleteOne({
                user: req.userId,
                meal: req.params.mealId,
            });

            return res.json({
                message: "Removed from favorites",
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Failed to remove favorite",
            });
        }
    }
);

export default router;
