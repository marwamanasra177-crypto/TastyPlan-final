export interface Category {
    id: string;
    name: string;
}

export interface Area {
    id: string;
    name: string;
}

export interface Ingredient {
    id: string;
    name: string;
}

export interface MealIngredient {
    id: string;
    measure: string | null;
    ingredient: Ingredient;
}

export interface Meal {
    id: string;
    themealdbId: string;
    name: string;
    instructions: string | null;
    image: string | undefined;
    youtubeUrl: string | null;

    category: Category | undefined;
    area: Area | null;

    mealIngredients?: MealIngredient[];
}

export interface MealsResponse {
    meals: Meal[] | null;
}

export interface CategoriesResponse {
    categories: Category[];
}

export interface AreasResponse {
    areas: Area[];
}

export interface IngredientsResponse {
    ingredients: Ingredient[];
}