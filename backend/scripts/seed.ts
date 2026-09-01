import "reflect-metadata";
import "dotenv/config";
import fs from "fs";
import path from "path";

import { AppDataSource } from "../data-source.js";

import { Meal } from "../entities/Meal.js";
import { Category } from "../entities/Category.js";
import { Area } from "../entities/Area.js";
import { Ingredient } from "../entities/Ingredient.js";
import { MealIngredient } from "../entities/MealIngredient.js";

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

        await AppDataSource.initialize();

        console.log("Database connected");

        const mealRepository =
            AppDataSource.getRepository(Meal);

        const categoryRepository =
            AppDataSource.getRepository(Category);

        const areaRepository =
            AppDataSource.getRepository(Area);

        const ingredientRepository =
            AppDataSource.getRepository(Ingredient);

        const mealIngredientRepository =
            AppDataSource.getRepository(MealIngredient);

        const filePath = path.join(
            process.cwd(),
            "data",
            "meals.json"
        );

        const file = fs.readFileSync(
            filePath,
            "utf-8"
        );

       const jsonData = JSON.parse(file);

const meals: MealJSON[] =
    jsonData.meals;

console.log(
    `Found ${meals.length} meals`
);

        for (const mealData of meals) {

            // -------------------------
            // Category
            // -------------------------

            let category: Category | null = null;

            if (mealData.strCategory) {

                category =
                    await categoryRepository.findOne({
                        where: {
                            name: mealData.strCategory
                        }
                    });

                if (!category) {

                    category =
                        categoryRepository.create({
                            name: mealData.strCategory,
                            image: null,
                            description: null
                        });

                    await categoryRepository.save(
                        category
                    );
                }
            }

            // -------------------------
            // Area
            // -------------------------

            let area: Area | null = null;

            if (mealData.strArea) {

                area =
                    await areaRepository.findOne({
                        where: {
                            name: mealData.strArea
                        }
                    });

                if (!area) {

                    area =
                        areaRepository.create({
                            name: mealData.strArea
                        });

                    await areaRepository.save(
                        area
                    );
                }
            }

            // -------------------------
            // Meal
            // -------------------------

            let meal =
                await mealRepository.findOne({
                    where: {
                        themealdbId:
                            mealData.idMeal
                    }
                });

            if (!meal) {

                meal =
                    mealRepository.create({

                        themealdbId:
                            mealData.idMeal,

                        name:
                            mealData.strMeal,

                        instructions:
                            mealData.strInstructions,

                        image:
                            mealData.strMealThumb,

                        youtubeUrl:
                            mealData.strYoutube,

                        category,

                        area
                    });

                await mealRepository.save(meal);
            }

            // -------------------------
            // Ingredients
            // -------------------------

            for (let i = 1; i <= 20; i++) {

                const ingredientName =
                    mealData[
                        `strIngredient${i}`
                    ];

                const measure =
                    mealData[
                        `strMeasure${i}`
                    ];

                if (
                    !ingredientName ||
                    !ingredientName.trim()
                ) {
                    continue;
                }

                const cleanIngredient =
                    ingredientName.trim();

                let ingredient =
                    await ingredientRepository.findOne({
                        where: {
                            name: cleanIngredient
                        }
                    });

                if (!ingredient) {

                    ingredient =
                        ingredientRepository.create({
                            name: cleanIngredient
                        });

                    await ingredientRepository.save(
                        ingredient
                    );
                }

                const existingRelation =
                    await mealIngredientRepository.findOne({
                        where: {
                            meal: {
                                id: meal.id
                            },
                            ingredient: {
                                id: ingredient.id
                            }
                        }
                    });

                if (!existingRelation) {

                    const mealIngredient =
                        mealIngredientRepository.create({

                            meal,

                            ingredient,

                            measure:
                                measure?.trim() || null

                        });

                    await mealIngredientRepository.save(
                        mealIngredient
                    );
                }
            }

            console.log(
                `Imported: ${mealData.strMeal}`
            );
        }

        console.log(
            "✅ Seed completed successfully"
        );

        await AppDataSource.destroy();

    } catch (error) {

        console.error(
            "❌ Seed failed:",
            error
        );

        process.exit(1);
    }
}

seed();
