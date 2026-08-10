import { useState } from "react";

import Favorites from "../../components/Favorites/Favorites";
import RecipeModal from "../../components/RecipeModal/RecipeModal";
import Header from "../../components/Header/Header";

import type { Meal } from "../../types/meal";
import SearchBar from "../../components/SearchBar/SearchBar";
import useDebounce from "../../hooks/useDebounce";

function FavoritesPage() {
            const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const [selectedMeal, setSelectedMeal] =
        useState<Meal | null>(null);

    return (
        <>
        <Header />
            <SearchBar setSearch={setSearch} />

            <Favorites
                onSelectMeal={setSelectedMeal}
            />
            <RecipeModal
                meal={selectedMeal}
                closeModal={() =>
                    setSelectedMeal(null)
                }
            />
        </>
    );
}

export default FavoritesPage;