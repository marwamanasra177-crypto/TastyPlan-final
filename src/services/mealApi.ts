const BASE_URL = "http://localhost:5000/api";

export const allMeals = () =>
    `${BASE_URL}/meals`;
export const searchMeals = (query: string) =>
    `${BASE_URL}/meals/search?name=${encodeURIComponent(query)}`;

export const randomMeal = () =>
    `${BASE_URL}/meals/random`;

export const categories = () =>
    `${BASE_URL}/categories`;

export const areas = () =>
    `${BASE_URL}/areas`;

export const ingredients = () =>
    `${BASE_URL}/ingredients`;

export const mealDetails = (id: string) =>
    `${BASE_URL}/meals/${id}`;

export const filterByCategory = (category: string) =>
    `${BASE_URL}/meals/category/${encodeURIComponent(category)}`;

export const filterByArea = (area: string) =>
    `${BASE_URL}/meals/area/${encodeURIComponent(area)}`;

export const filterByIngredient = (ingredient: string) =>
    `${BASE_URL}/meals/ingredient/${encodeURIComponent(ingredient)}`;