import { useState } from "react";
import "./App.css";
import { useTheme } from "../components/Context/Context";
import Header from "../components/Header/Header";
import RecipeGrid from "../components/RecipeGrid/RecipeGrid";
import useDebounce from "../hooks/useDebounce";
import useFetch from "../hooks/useFetch";
import SearchBar from "../../src/components/SearchBar/SearchBar"
import { searchMeals } from "../services/mealApi";
import type { MealsResponse } from "../types/meal";
import LoadingSkeleton from "../components/LoadingSkeleton/LoadingSkeleton";
import EmptyState from "../components/EmptyState/EmptyState";
import CategoryFilter from "../components/CategoryFilter/CategoryFilter";
import type { Meal } from "../types/meal";
import RecipeModal from "../components/RecipeModal/RecipeModal";
import { filterByCategory } from "../services/mealApi";
import { randomMeal } from "../services/mealApi";

function luncher() {
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
  
}