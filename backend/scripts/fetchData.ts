import { writeFile } from "node:fs/promises";

const BASE_URL =
    "https://www.themealdb.com/api/json/v1/1";

async function fetchData() {

    // =========================
    // Categories
    // =========================

    const categoriesResponse =
        await fetch(
            `${BASE_URL}/categories.php`
        );

    const categoriesData =
        await categoriesResponse.json();

    await writeFile(
        "./data/categories.json",
        JSON.stringify(
            categoriesData,
            null,
            2
        )
    );

    console.log(
        "Categories saved successfully!"
    );


    // =========================
    // Areas
    // =========================

    const areasResponse =
        await fetch(
            `${BASE_URL}/list.php?a=list`
        );

    const areasData =
        await areasResponse.json();

    await writeFile(
        "./data/areas.json",
        JSON.stringify(
            areasData,
            null,
            2
        )
    );

    console.log(
        "Areas saved successfully!"
    );


    // =========================
    // Ingredients
    // =========================

    const ingredientsResponse =
        await fetch(
            `${BASE_URL}/list.php?i=list`
        );

    const ingredientsData =
        await ingredientsResponse.json();

    await writeFile(
        "./data/ingredients.json",
        JSON.stringify(
            ingredientsData,
            null,
            2
        )
    );

    console.log(
        "Ingredients saved successfully!"
    );


    // =========================
    // Meals
    // =========================

    const allMeals = new Map();

    const categories =
        categoriesData.categories;

    for (const category of categories) {

        console.log(
            `Getting meals from ${category.strCategory}...`
        );

        const response =
            await fetch(
                `${BASE_URL}/filter.php?c=${encodeURIComponent(
                    category.strCategory
                )}`
            );

        const result =
            await response.json();

        if (!result.meals) {
            continue;
        }

        for (const meal of result.meals) {

            allMeals.set(
                meal.idMeal,
                meal
            );

        }

    }

    console.log(
        `Found ${allMeals.size} unique meals.`
    );


    // =========================
    // Get full meal details
    // =========================

    const fullMeals = [];

    for (const meal of allMeals.values()) {

        console.log(
            `Getting details for ${meal.strMeal}...`
        );

        const response =
            await fetch(
                `${BASE_URL}/lookup.php?i=${meal.idMeal}`
            );

        const result =
            await response.json();

        if (result.meals) {

            fullMeals.push(
                result.meals[0]
            );

        }

    }


    // =========================
    // Save meals
    // =========================

    await writeFile(
        "./data/meals.json",
        JSON.stringify(
            {
                meals: fullMeals
            },
            null,
            2
        )
    );

    console.log(
        `Saved ${fullMeals.length} meals successfully!`
    );

}

fetchData();