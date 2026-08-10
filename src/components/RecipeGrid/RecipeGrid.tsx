import type { Meal } from "../../types/meal";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./RecipeGrid.css";

// interface RecipeGridProps {
//   meals: Meal[];
//   onSelectMeal: (meal: Meal) => void;
// }
interface RecipeGridProps {
    meals: Meal[];
    onSelectMeal: (meal: Meal) => void;
    className?: string;
}

function RecipeGrid( {meals,onSelectMeal, className}: RecipeGridProps) 
{
  return (
<div className={`recipe-grid ${className ?? ""}`}>      {
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