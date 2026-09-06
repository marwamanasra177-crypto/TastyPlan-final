import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Favorite } from "../entities/Favorite.js";
import { Meal } from "../entities/Meal.js";
import { User } from "../entities/User.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../middleware/auth.js";

const router = Router();

const favoriteRepository = AppDataSource.getRepository(Favorite);
const mealRepository = AppDataSource.getRepository(Meal);

/*
|--------------------------------------------------------------------------
| Get my favorites
|--------------------------------------------------------------------------
*/

router.get("/", requireAuth, async (req: AuthedRequest, res) => {

    try {

        const favorites = await favoriteRepository.find({
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
                createdAt: "DESC",
            },
        });

        return res.json({
            meals: favorites.map((favorite: Favorite) => favorite.meal),
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

        const meal = await mealRepository.findOne({
            where: { id: Number(mealId) },
        });

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        const existing = await favoriteRepository.findOne({
            where: {
                user: { id: req.userId! },
                meal: { id: meal.id },
            },
        });

        if (existing) {
            return res.status(200).json({
                message: "Already in favorites",
            });
        }

        const favorite = favoriteRepository.create({
            user: { id: req.userId! } as User,
            meal,
        });

        await favoriteRepository.save(favorite);

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

            const mealId = Number(req.params.mealId);

            await favoriteRepository.delete({
                user: { id: req.userId! } as User,
                meal: { id: mealId } as Meal,
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
