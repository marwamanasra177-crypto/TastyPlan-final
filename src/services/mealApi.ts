const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const searchMeals = (query: string) =>
  `${BASE_URL}/search.php?s=${query}`;

export const randomMeal = () =>
  `${BASE_URL}/random.php`;

export const categories = () =>
  `${BASE_URL}/categories.php`;

export const filterByArea = (area: string) =>
  `${BASE_URL}/filter.php?a=${area}`;

export const mealDetails = (id:string) =>
  `${BASE_URL}/lookup.php?i=${id}`;

export const filterByCategory = (category: string) =>
  `${BASE_URL}/filter.php?c=${category}`;

