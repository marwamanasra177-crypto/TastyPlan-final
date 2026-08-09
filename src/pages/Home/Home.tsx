import "./Home.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";

import RecipeGrid from "../../components/RecipeGrid/RecipeGrid";
import EmptyState from "../../components/EmptyState/EmptyState";
import RecipeModal from "../../components/RecipeModal/RecipeModal";
import LoadingSkeleton from "../../components/LoadingSkeleton/LoadingSkeleton";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { useState } from "react";

import useDebounce from "../../hooks/useDebounce";
import useFetch from "../../hooks/useFetch";
import { useTheme } from "../../components/Context/Context";

import { searchMeals } from "../../services/mealApi";
import { filterByCategory } from "../../services/mealApi";
import { randomMeal } from "../../services/mealApi";

import type { MealsResponse } from "../../types/meal";
import type { Meal } from "../../types/meal"

function Home() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const debouncedSearch = useDebounce(search, 500);

    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [randomRecipe, setRandomRecipe] = useState<Meal | null>(null);

    const url =
        selectedCategory ? filterByCategory(selectedCategory)
            : debouncedSearch ? searchMeals(debouncedSearch)
                : "";

    const { data, loading, error } = useFetch<MealsResponse>(url);

    const { theme } = useTheme();

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

    return (
        <main className={theme}>

            <Header />

            <SearchBar setSearch={setSearch} />
            <div className="category-filter-container">
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
                <button onClick={getRandomMeal} className="random-meal-button">
                    🎲
                </button>
            </div>
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
export default Home;



