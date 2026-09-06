import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../db/mongoose.js";
import { Meal } from "../models/Meal.js";
import { Category } from "../models/Category.js";
import { Area } from "../models/Area.js";
import { Ingredient } from "../models/Ingredient.js";
interface MealJSON {
    idMeal: string;
    strMeal: string;
    strCategory: string | null;
    strArea: string | null;
    strInstructions: string | null;
    strMealThumb: string | null;
    strYoutube: string | null;
    [key: string]: string | null;
}
async function seed() {
    try {
        await connectDB();
        const filePath = path.join(
            process.cwd(),
            "data",
            "meals.json"
        );
        const file = fs.readFileSync(filePath, "utf-8");
        const jsonData = JSON.parse(file);
        const meals: MealJSON[] = jsonData.meals;
        console.log(`Found ${meals.length} meals`);
        for (const mealData of meals) {
            // -------------------------
            // Skip meals that already exist
            // -------------------------
            const existingMeal = await Meal.findOne({
                themealdbId: mealData.idMeal,
            });
            if (existingMeal) {
                console.log(
                    `Skipped (already exists): ${mealData.strMeal}`
                );
                continue;
            }
            // -------------------------
            // Category
            // -------------------------
            let category = null;
            if (mealData.strCategory) {
                category = await Category.findOne({
                    name: mealData.strCategory,
                });
                if (!category) {
                    category = await Category.create({
                        name: mealData.strCategory,
                        image: null,
                        description: null,
                    });
                }
            }
            // -------------------------
            // Area
            // -------------------------
            let area = null;
            if (mealData.strArea) {
                area = await Area.findOne({
                    name: mealData.strArea,
                });
                if (!area) {
                    area = await Area.create({
                        name: mealData.strArea,
                    });
                }
            }
            // -------------------------
            // Ingredients
            // -------------------------
            const mealIngredients: {
                ingredient: mongoose.Types.ObjectId;
                measure: string | null;
            }[] = [];
            for (let i = 1; i <= 20; i++) {
                const ingredientName = mealData[`strIngredient${i}`];
                const measure = mealData[`strMeasure${i}`];
                if (!ingredientName || !ingredientName.trim()) {
                    continue;
                }
                const cleanIngredient = ingredientName.trim();
                let ingredient = await Ingredient.findOne({
                    name: cleanIngredient,
                });
                if (!ingredient) {
                    ingredient = await Ingredient.create({
                        name: cleanIngredient,
                    });
                }
                mealIngredients.push({
                    ingredient: ingredient._id,
                    measure: measure?.trim() || null,
                });
            }
            // -------------------------
            // Meal
            // -------------------------
            await Meal.create({
                themealdbId: mealData.idMeal,
                name: mealData.strMeal,
                instructions: mealData.strInstructions,
                image: mealData.strMealThumb,
                youtubeUrl: mealData.strYoutube,
                category: category ? category._id : null,
                area: area ? area._id : null,
                mealIngredients,
            });
            console.log(`Imported: ${mealData.strMeal}`);
        }
        console.log("✅ Seed completed successfully");
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}
seed();
