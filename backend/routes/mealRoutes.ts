import { Router } from "express";
import { Meal } from "../models/Meal.js";
import { Category } from "../models/Category.js";
import { Area } from "../models/Area.js";
import { Ingredient } from "../models/Ingredient.js";

const router = Router();

// Escapes user input before it's used inside a RegExp
function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET all meals
router.get("/", async (req, res) => {

    try {

        const meals = await Meal.find()
            .populate("category")
            .populate("area");

        res.json({
            meals,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch meals",
        });
    }
});

// GET random meal
router.get("/random", async (req, res) => {

    try {

        const [randomDoc] = await Meal.aggregate([
            { $sample: { size: 1 } },
        ]);

        if (!randomDoc) {

            return res.status(404).json({
                message: "No meals found",
            });

        }

        const meal = await Meal.populate(randomDoc, [
            { path: "category" },
            { path: "area" },
        ]);

        res.json({
            meals: [meal],
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get random meal",
        });
    }
});

// GET meals by category
router.get("/category/:category", async (req, res) => {

    try {

        const categoryName = req.params.category;

        const categoryDoc = await Category.findOne({
            name: new RegExp(
                `^${escapeRegex(categoryName)}$`,
                "i"
            ),
        });

        if (!categoryDoc) {
            return res.json({ meals: [] });
        }

        const meals = await Meal.find({
            category: categoryDoc._id,
        })
            .populate("category")
            .populate("area");

        res.json({
            meals,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch meals by category",
        });
    }
});

// GET meals by area
router.get("/area/:area", async (req, res) => {

    try {

        const areaName = req.params.area;

        const areaDoc = await Area.findOne({
            name: new RegExp(`^${escapeRegex(areaName)}$`, "i"),
        });

        if (!areaDoc) {
            return res.json({ meals: [] });
        }

        const meals = await Meal.find({
            area: areaDoc._id,
        })
            .populate("category")
            .populate("area");

        res.json({
            meals,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch meals by area",
        });
    }
});

// GET meals by ingredient
router.get("/ingredient/:ingredient", async (req, res) => {

    try {

        const ingredientName = req.params.ingredient;

        const ingredientDoc = await Ingredient.findOne({
            name: new RegExp(
                `^${escapeRegex(ingredientName)}$`,
                "i"
            ),
        });

        if (!ingredientDoc) {
            return res.json({ meals: [] });
        }

        const meals = await Meal.find({
            "mealIngredients.ingredient": ingredientDoc._id,
        })
            .populate("category")
            .populate("area");

        res.json({
            meals,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch meals by ingredient",
        });
    }
});

// GET meals by name
router.get("/search", async (req, res) => {

    try {

        const searchTerm = String(req.query.name || "").trim();

        if (!searchTerm) {

            return res.status(400).json({
                message: "Search name is required",
            });

        }

        const meals = await Meal.find({
            name: new RegExp(escapeRegex(searchTerm), "i"),
        })
            .populate("category")
            .populate("area");

        res.json({
            meals,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to search meals",
        });

    }

});

// GET meal by ID
router.get("/:id", async (req, res) => {

    try {

        const meal = await Meal.findById(req.params.id)
            .populate("category")
            .populate("area")
            .populate("mealIngredients.ingredient");

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        res.json(meal);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch meal",
        });

    }

});

export default router;
