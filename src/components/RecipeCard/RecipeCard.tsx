import type { Meal } from "../../types/meal";
import "./RecipeCard.css";

interface RecipeCardProps {
  meal: Meal;
  onSelectMeal: (meal: Meal) => void;
}

function RecipeCard({ meal, onSelectMeal }: RecipeCardProps) {
    return (
        <div
            className="recipe-card"
            onClick={() => onSelectMeal(meal)}
        >
            <img
                src={meal.image ?? ""}
                alt={meal.name}
                className="recipe-image"
            />

            <div className="recipe-info">

                <h3>
                    {meal.name}
                </h3>

                <p>
                    {meal.category?.name}
                </p>

                <p>
                    {meal.area?.name}
                </p>

            </div>
        </div>
    );
}
export default RecipeCard;