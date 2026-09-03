import { Router } from "express";
import { MealPlan } from "../models/MealPlan.js";
import { Meal } from "../models/Meal.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../middleware/auth.js";

const router = Router();

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

/*
|--------------------------------------------------------------------------
| Get my meal plan (grouped by day)
|--------------------------------------------------------------------------
*/

router.get("/", requireAuth, async (req: AuthedRequest, res) => {

    try {

        const entries = await MealPlan.find({
            user: req.userId,
        })
            .populate({
                path: "meal",
                populate: [
                    { path: "category" },
                    { path: "area" },
                ],
            })
            .sort({ createdAt: 1 });

        const plan: Record<string, unknown[]> = {};

        for (const day of DAYS) {
            plan[day] = [];
        }

        for (const entry of entries) {
            if (!plan[entry.day]) {
                plan[entry.day] = [];
            }
            (plan[entry.day] as unknown[]).push(entry.meal);
        }

        return res.json({
            mealPlan: plan,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to load meal plan",
        });
    }
});

/*
|--------------------------------------------------------------------------
| Add a meal to a day
|--------------------------------------------------------------------------
*/

router.post("/", requireAuth, async (req: AuthedRequest, res) => {

    try {

        const { day, mealId } = req.body;

        if (!day || !mealId || !DAYS.includes(day)) {
            return res.status(400).json({
                message: "A valid day and mealId are required",
            });
        }

        const meal = await Meal.findById(mealId);

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        await MealPlan.create({
            user: req.userId,
            day,
            meal: meal._id,
        });

        return res.status(201).json({
            message: "Meal added to plan",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to add meal to plan",
        });
    }
});

/*
|--------------------------------------------------------------------------
| Remove a meal from a day
|--------------------------------------------------------------------------
*/

router.delete(
    "/:day/:mealId",
    requireAuth,
    async (req: AuthedRequest, res) => {

        try {

            await MealPlan.deleteOne({
                user: req.userId,
                day: req.params.day,
                meal: req.params.mealId,
            });

            return res.json({
                message: "Meal removed from plan",
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Failed to remove meal from plan",
            });
        }
    }
);

/*
|--------------------------------------------------------------------------
| Clear the whole week
|--------------------------------------------------------------------------
*/

router.delete("/", requireAuth, async (req: AuthedRequest, res) => {

    try {

        await MealPlan.deleteMany({
            user: req.userId,
        });

        return res.json({
            message: "Meal plan cleared",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to clear meal plan",
        });
    }
});

export default router;
