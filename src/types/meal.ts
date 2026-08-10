export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;

  [key: string]: string | null;

}

export interface MealsResponse {
  meals: Meal[] | null;
}
export interface Category {
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
}

export interface CategoriesResponse {
    categories: Category[];
}

// export const AREAS = [
//   "American",
//   "British",
//   "Canadian",
//   "Chinese",
//   "Croatian",
//   "Dutch",
//   "Egyptian",
//   "French",
//   "Greek",
//   "Indian",
//   "Irish",
//   "Italian",
//   "Japanese",
//   "Mexican",
//   "Moroccan",
//   "Polish",
//   "Portuguese",
//   "Russian",
//   "Spanish",
//   "Thai",
//   "Tunisian",
//   "Turkish",
//   "Vietnamese",
// ];