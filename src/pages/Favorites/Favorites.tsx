import { useState } from "react";

import Favorites from "../../components/Favorites/Favorites";
import RecipeModal from "../../components/RecipeModal/RecipeModal";
import Header from "../../components/Header/Header";

import type { Meal } from "../../types/meal";

function FavoritesPage() {

    const [selectedMeal, setSelectedMeal] =
        useState<Meal | null>(null);

    return (
        <>
        <Header />
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