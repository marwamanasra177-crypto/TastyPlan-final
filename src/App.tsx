import { useState } from "react";
import "./App.css";
import { useTheme } from "./components/Context/Context";
import Header from "./components/Header/Header";
import RecipeGrid from "./components/RecipeGrid/RecipeGrid";
import useDebounce from "./hooks/useDebounce";
import useFetch from "./hooks/useFetch";
import SearchBar from "../src/components/SearchBar/SearchBar"
import { searchMeals } from "./services/mealApi";
import type { MealsResponse } from "./types/meal";
import LoadingSkeleton from "./components/LoadingSkeleton/LoadingSkeleton";
import EmptyState from "./components/EmptyState/EmptyState";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import type { Meal } from "./types/meal";
import RecipeModal from "./components/RecipeModal/RecipeModal";
import { filterByCategory } from "./services/mealApi";
import { randomMeal } from "./services/mealApi";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [randomRecipe, setRandomRecipe] = useState<Meal | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { theme } = useTheme();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const url = selectedCategory ? filterByCategory(selectedCategory) : debouncedSearch ? searchMeals(debouncedSearch): "";
  const getRandomMeal = async () => {
    try {
      const response = await fetch(randomMeal());

      const result: MealsResponse = await response.json();

      if (result.meals) {
        setRandomRecipe(result.meals[0]);
      }

    } catch (error) {
      console.log(error);
    }
  };
  const { data, loading, error } =
    useFetch<MealsResponse>(url);
    
  return (
    <main className={theme}>
      <Header />

      <SearchBar setSearch={setSearch} />
      <button onClick={getRandomMeal} className="random-meal-button">
        🎲 Surprise Me
      </button>
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {loading && <LoadingSkeleton />}
      {error && <p>{error}</p>}
      {data?.meals && data.meals.length > 0 && (
        <RecipeGrid
          meals={data.meals}
          onSelectMeal={setSelectedMeal}
        />
      )}
      {!loading && search && data?.meals === null && (
        <EmptyState message="No recipes found. Try another search!" />
      )}
      {!loading && !search && (
        <EmptyState message="Search for delicious recipes to get started!" />
      )}
      <RecipeModal
        meal={selectedMeal || randomRecipe}
        closeModal={() => {
          setSelectedMeal(null);
          setRandomRecipe(null);
        }}
      />
    </main>

  );
}
export default App;