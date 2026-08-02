const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const searchMeals = (query: string) =>
  `${BASE_URL}/search.php?s=${query}`;

export const randomMeal = () =>
  `${BASE_URL}/random.php`;

export const categories = () =>
  `${BASE_URL}/categories.php`;