import { Router } from "express";

import { Category } from "../models/Category.js";
import { Area } from "../models/Area.js";
import { Ingredient } from "../models/Ingredient.js";

const router = Router();


// Categories

router.get("/categories", async (req, res) => {

    try {

        const categories = await Category.find();

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

        const areas = await Area.find();

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

        const ingredients = await Ingredient.find();

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
