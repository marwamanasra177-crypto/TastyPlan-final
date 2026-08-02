import type { Meal } from "../../types/meal";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./RecipeGrid.css";

interface RecipeGridProps {
  meals: Meal[];
}
function RecipeGrid({ meals }: RecipeGridProps) {
  return (
    <div className="recipe-grid">
      {meals.map((meal) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
        />
      ))}
    </div>
  );
}

export default RecipeGrid;