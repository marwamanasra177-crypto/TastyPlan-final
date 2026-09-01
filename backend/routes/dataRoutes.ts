import { Router } from "express";

import { AppDataSource } from "../data-source.js";

import { Category } from "../entities/Category.js";
import { Area } from "../entities/Area.js";
import { Ingredient } from "../entities/Ingredient.js";

const router = Router();

const categoryRepository =
    AppDataSource.getRepository(Category);

const areaRepository =
    AppDataSource.getRepository(Area);

const ingredientRepository =
    AppDataSource.getRepository(Ingredient);


// Categories

router.get("/categories", async (req, res) => {

    try {

        const categories =
            await categoryRepository.find();

        res.json({
            categories,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch categories",
        });
    }
});


// Areas

router.get("/areas", async (req, res) => {

    try {

        const areas =
            await areaRepository.find();

        res.json({
            areas,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch areas",
        });
    }
});


// Ingredients


router.get("/ingredients", async (req, res) => {

    try {

        const ingredients =
            await ingredientRepository.find();

        res.json({
            ingredients,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch ingredients",
        });
    }
});


export default router;