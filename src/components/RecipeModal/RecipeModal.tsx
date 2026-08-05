import "./RecipeModal.css";
import type { Meal, MealsResponse } from "../../types/meal";
import useFetch from "../../hooks/useFetch";
import { mealDetails } from "../../services/mealApi";

interface RecipeModalProps {
  meal: Meal | null;
  closeModal: () => void;
}

function RecipeModal({
  meal,
  closeModal,
}: RecipeModalProps) {
  if (!meal) return null;

  const { data, loading, error } = useFetch<MealsResponse>(
    mealDetails(meal.idMeal)
  );

  const fullMeal = data?.meals?.[0];

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!fullMeal) return null;
const ingredients = [];

for (let i = 1; i <= 20; i++) {
  const ingredient = fullMeal[`strIngredient${i}`];
  const measure = fullMeal[`strMeasure${i}`];

  if (ingredient && ingredient.trim() !== "") {
    ingredients.push({
      ingredient,
      measure,
    });
  }
}
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="close"
          onClick={closeModal}
        >
          ✖
        </button>

        <img
          src={fullMeal.strMealThumb}
          alt={fullMeal.strMeal}
          className="modal-image"
        />

        <h2>{fullMeal.strMeal}</h2>

        <p>
          <strong>Category:</strong> {fullMeal.strCategory}
        </p>

        <p>
          <strong>Country:</strong> {fullMeal.strArea}
        </p>
<h3>Ingredients</h3>

<ul className="ingredients-list">
  {ingredients.map((item, index) => (
    <li key={index}>
      <input type="checkbox" />

      {item.measure} {item.ingredient}
    </li>
  ))}
</ul>
        <h3>Instructions</h3>

        <p className="instructions">
          {fullMeal.strInstructions}
        </p>

        {fullMeal.strYoutube && (
          <a
            href={fullMeal.strYoutube}
            target="_blank"
            rel="noreferrer"
          >
            Watch cooking video 🎥
          </a>
        )}
      </div>
    </div>
  );
}

export default RecipeModal;