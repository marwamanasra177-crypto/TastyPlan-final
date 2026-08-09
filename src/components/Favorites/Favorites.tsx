import "./Favorites.css";
import { useFavorites } from "../Context/FavoritesContext";
import RecipeGrid from "../RecipeGrid/RecipeGrid";
import EmptyState from "../EmptyState/EmptyState";
import type { Meal } from "../../types/meal";

interface FavoritesProps {
    onSelectMeal: (meal: Meal) => void;
}
function Favorites(
    { onSelectMeal }: FavoritesProps
) {
    const { favorites } = useFavorites();

    if (favorites.length === 0) {
        return (
            <EmptyState 
                message="No favorite recipes yet!"
            />
        );
    }
    return (
        <section className="favorites-section">  
            <h2>
                ❤️ My Favorites
            </h2>

            <RecipeGrid
                meals={favorites}
                onSelectMeal={onSelectMeal}
            />

        </section>
    );
}

export default Favorites;