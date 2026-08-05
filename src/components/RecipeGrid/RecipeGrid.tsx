import type { Meal } from "../../types/meal";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./RecipeGrid.css";

interface RecipeGridProps {
  meals: Meal[];
  onSelectMeal: (meal: Meal) => void;
}
function RecipeGrid( {meals,onSelectMeal}: RecipeGridProps) 
{
  return (
    <div className="recipe-grid">
      {
        meals.map((meal) => (
          <RecipeCard
            key={meal.idMeal}
            meal={meal}
            onSelectMeal={onSelectMeal}
          />
        ))
      }
    </div>
  );

}


export default RecipeGrid;