import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Meal } from "../entities/Meal.js";

const router = Router();

const mealRepository =
    AppDataSource.getRepository(Meal);


// GET all meals
router.get("/", async (req, res) => {

    try {

        const meals = await mealRepository.find({
            relations: {
                category: true,
                area: true,
            },
        });

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

        const meal =
            await mealRepository
                .createQueryBuilder("meal")
                .leftJoinAndSelect(
                    "meal.category",
                    "category"
                )
                .leftJoinAndSelect(
                    "meal.area",
                    "area"
                )
                .orderBy("RAND()")
                .getOne();

        if (!meal) {

            return res.status(404).json({
                message: "No meals found",
            });

        }

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

        const category = req.params.category;

        const meals =
            await mealRepository
                .createQueryBuilder("meal")
                .leftJoinAndSelect(
                    "meal.category",
                    "category"
                )
                .leftJoinAndSelect(
                    "meal.area",
                    "area"
                )
                .where(
                    "LOWER(category.name) = LOWER(:category)",
                    { category }
                )
                .getMany();

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

        const area = req.params.area;

        const meals =
            await mealRepository
                .createQueryBuilder("meal")
                .leftJoinAndSelect(
                    "meal.category",
                    "category"
                )
                .leftJoinAndSelect(
                    "meal.area",
                    "area"
                )
                .where(
                    "LOWER(area.name) = LOWER(:area)",
                    { area }
                )
                .getMany();

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

        const ingredient = req.params.ingredient;

        const meals =
            await mealRepository
                .createQueryBuilder("meal")
                .leftJoinAndSelect(
                    "meal.category",
                    "category"
                )
                .leftJoinAndSelect(
                    "meal.area",
                    "area"
                )
                .innerJoin(
                    "meal.mealIngredients",
                    "mealIngredient"
                )
                .innerJoin(
                    "mealIngredient.ingredient",
                    "ingredient"
                )
                .where(
                    "LOWER(ingredient.name) = LOWER(:ingredient)",
                    { ingredient }
                )
                .getMany();

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

        const searchTerm =
            String(req.query.name || "")
                .trim();

        if (!searchTerm) {

            return res.status(400).json({
                message: "Search name is required",
            });

        }

        const meals =
            await mealRepository
                .createQueryBuilder("meal")
                .leftJoinAndSelect(
                    "meal.category",
                    "category"
                )
                .leftJoinAndSelect(
                    "meal.area",
                    "area"
                )
                .where(
                    "LOWER(meal.name) LIKE LOWER(:name)",
                    {
                        name: `%${searchTerm}%`,
                    }
                )
                .getMany();

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

        const meal =
            await mealRepository.findOne({
                where: {
                    id: Number(req.params.id),
                },

                relations: {
                    category: true,
                    area: true,
                    mealIngredients: {
                        ingredient: true,
                    },
                },
            });

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



// import express from "express";
// import { readFile } from "node:fs/promises";

// const router = express.Router();

// async function getMeals() {

//     const data = await readFile(
//         "./data/meals.json",
//         "utf-8"
//     );

//     return JSON.parse(data);
// }

// router.get("/search", async (req, res) => {

//     try {

//         const data = await getMeals();

//         const searchTerm =
//             String(req.query.name || "")
//                 .toLowerCase()
//                 .trim();

//         if (!searchTerm) {

//             return res.status(400).json({
//                 message: "Search name is required"
//             });

//         }

//         const meals = data.meals.filter(
//             (meal: any) =>
//                 meal.strMeal
//                     ?.toLowerCase()
//                     .includes(searchTerm)
//         );

//         res.json({
//             meals
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: "Failed to search meals"
//         });

//     }

// });
// router.get("/random", async (req, res) => {

//     try {

//         const data = await getMeals();

//         const randomIndex =
//             Math.floor(
//                 Math.random() * data.meals.length
//             );

//         const randomMeal =
//             data.meals[randomIndex];

//         res.json({
//             meals: [randomMeal]
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: "Failed to get random meal"
//         });

//     }

// });
// router.get("/category/:category", async (req, res) => {

//     try {

//         const data = await getMeals();

//         const category =
//             String(req.params.category)
//                 .toLowerCase()
//                 .trim();

//         const meals =
//             data.meals.filter(
//                 (meal: any) =>
//                     meal.strCategory
//                         ?.toLowerCase()
//                         .trim() === category
//             );

//         res.json({
//             meals
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: "Failed to filter meals by category"
//         });

//     }

// });
// router.get("/", async (req, res) => {

//     try {

//         const data = await getMeals();

//         res.json(data);

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: "Failed to load meals"
//         });

//     }

// });
// router.get("/area/:area", async (req, res) => {

//     try {

//         const data = await getMeals();

//         const area =
//             String(req.params.area)
//                 .toLowerCase()
//                 .trim();

//         const meals =
//             data.meals.filter(
//                 (meal: any) =>
//                     meal.strArea
//                         ?.toLowerCase()
//                         .trim() === area
//             );

//         res.json({
//             meals
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: "Failed to filter meals by area"
//         });

//     }

// });
// router.get("/ingredient/:ingredient", async (req, res) => {

//     try {

//         const data = await getMeals();

//         const ingredient =
//             String(req.params.ingredient)
//                 .toLowerCase()
//                 .trim();

//         const meals =
//             data.meals.filter((meal: any) => {

//                 for (let i = 1; i <= 20; i++) {

//                     const mealIngredient =
//                         meal[`strIngredient${i}`];

//                     if (
//                         mealIngredient &&
//                         mealIngredient
//                             .toLowerCase()
//                             .trim() === ingredient
//                     ) {
//                         return true;
//                     }

//                 }

//                 return false;

//             });

//         res.json({
//             meals
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message:
//                 "Failed to filter meals by ingredient"
//         });

//     }

// });

// router.get("/:id", async (req, res) => {

//     try {

//         const data = await getMeals();

//         const meal = data.meals.find(
//             (meal: any) =>
//                 meal.idMeal === req.params.id
//         );


//         if (!meal) {

//             return res.status(404).json({
//                 message: "Meal not found"
//             });

//         }

//         res.json({
//             meals: [meal]
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: "Failed to load meal"
//         });

//     }

// });




// export default router;