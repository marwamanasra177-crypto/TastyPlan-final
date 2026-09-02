import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { MealPlan } from "../entities/MealPlan.js";
import { Meal } from "../entities/Meal.js";
import { User } from "../entities/User.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../middleware/auth.js";

const router = Router();

const planRepository = AppDataSource.getRepository(MealPlan);
const mealRepository = AppDataSource.getRepository(Meal);

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

        const entries = await planRepository.find({
            where: {
                user: { id: req.userId! },
            },
            relations: {
                meal: {
                    category: true,
                    area: true,
                },
            },
            order: {
                createdAt: "ASC",
            },
        });

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

        const meal = await mealRepository.findOne({
            where: { id: Number(mealId) },
        });

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        const entry = planRepository.create({
            user: { id: req.userId! } as User,
            day,
            meal,
        });

        await planRepository.save(entry);

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

            const day = req.params.day as string;
            const mealId = Number(req.params.mealId);

            await planRepository.delete({
                user: { id: req.userId! } as User,
                day,
                meal: { id: mealId } as Meal,
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

        await planRepository.delete({
            user: { id: req.userId! } as User,
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
