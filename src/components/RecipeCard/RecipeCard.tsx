import type { Meal } from "../../types/meal";
import "./RecipeCard.css";


interface RecipeCardProps {
  meal: Meal;
  onSelectMeal: (meal: Meal) => void;
}
function RecipeCard( {meal,onSelectMeal}: RecipeCardProps) {
  return (

    <div
      className="recipe-card"
      onClick={() => onSelectMeal(meal)}
    >
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="recipe-image"
      />
      <div className="recipe-info">

        <h3>
          {meal.strMeal}
        </h3>
        <p>
          {meal.strCategory}
        </p>
        <p>
          {meal.strArea}
        </p>
      </div>
    </div>
  );
}
export default RecipeCard;