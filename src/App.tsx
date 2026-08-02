import { useState } from "react";

import Header from "./components/Header/Header";
// import SearchBar from "./components/SearchBar/SearchBar";
import RecipeGrid from "./components/RecipeGrid/RecipeGrid";

import useDebounce from "./hooks/useDebounce";
import useFetch from "./hooks/useFetch";
import SearchBar from "../src/components/SearchBar/SearchBar"
import { searchMeals } from "./services/mealApi";
import type { MealsResponse } from "./types/meal";
import LoadingSkeleton from "./components/LoadingSkeleton/LoadingSkeleton";
import EmptyState from "./components/EmptyState/EmptyState";

function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data, loading, error } = useFetch<MealsResponse>(
    debouncedSearch
      ? searchMeals(debouncedSearch)
      : ""
  );

  return (
    <main>
      <Header />
      <SearchBar setSearch={setSearch} />
      {loading && <LoadingSkeleton />}
      {error && <p>{error}</p>}
      {data?.meals && data.meals.length > 0 && (
        <RecipeGrid meals={data.meals} />
      )}
      {!loading && search && data?.meals === null && (
        <EmptyState message="No recipes found. Try another search!" />
      )}
      {!loading && !search && (
        <EmptyState message="Search for delicious recipes to get started!" />
      )}
    </main>
  );
}


export default App;