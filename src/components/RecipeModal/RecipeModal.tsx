
import "./RecipeModal.css";
import type { Meal, MealsResponse } from "../../types/meal";
import useFetch from "../../hooks/useFetch";
import { mealDetails } from "../../services/mealApi";
import { useState } from "react";
import { useMealPlan } from "../MealPlanContext/MealPlanContext";
import type { Day } from "../../reducer/mealPlanReducer";
import { useFavorites } from "../Context/FavoritesContext";

interface RecipeModalProps {
  meal: Meal | null;
  closeModal: () => void;
}

const days: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function RecipeModal({
  meal,
  closeModal,
}: RecipeModalProps) {

  const {
    toggleFavorite,
    isFavorite
  } = useFavorites();

  const { dispatch } = useMealPlan();

  const [selectedDay, setSelectedDay] =
    useState<Day>("Monday");
  const url = meal
    ? mealDetails(meal.idMeal)
    : "";

  const { data, loading, error } =
    useFetch<MealsResponse>(url);

  if (!meal) {
    return null;
  }

  const favorite = isFavorite(meal.idMeal);

  const fullMeal = data?.meals?.[0];

  if (loading) {
    return (
      <div className="modal-overlay">

        <div className="modal">

          <button
            className="close"
            onClick={closeModal}
          >
            ✖
          </button>

          <p>
            Loading recipe...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">

        <div className="modal">

          <button
            className="close"
            onClick={closeModal}
          >
            ✖
          </button>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }

  if (!fullMeal) {
    return null;
  }

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {

    const ingredient =
      fullMeal[`strIngredient${i}`];

    const measure =
      fullMeal[`strMeasure${i}`];

    if (
      ingredient &&
      ingredient.trim() !== ""
    ) {

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
        <h2>
          {fullMeal.strMeal}
        </h2>
        <p>
          <strong>Category:</strong>{" "}
          {fullMeal.strCategory}
        </p>
        <p>
          <strong>Country:</strong>{" "}
          {fullMeal.strArea}
        </p>
        <button
          onClick={() =>
            toggleFavorite(fullMeal)
          }
        >
          {favorite
            ? "❤️ Remove from Favorites"
            : "🤍 Add to Favorites"
          }
        </button>
        <h3>
          Ingredients
        </h3>
        <ul className="ingredients-list">
          {ingredients.map((item, index) => (
            <li key={index}>
              <input
                type="checkbox"
              />
              {item.measure}{" "}
              {item.ingredient}
            </li>
          ))}
        </ul>
        <div>
          <select
            value={selectedDay}
            onChange={(e) =>
              setSelectedDay(
                e.target.value as Day
              )
            }
          >
            {days.map((day) => (
              <option
                key={day}
                value={day}
              >
                {day}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              dispatch({
                type: "ADD_MEAL",
                payload: {
                  day: selectedDay,
                  meal: fullMeal
                }
              });
              closeModal();
            }}
          >
            Add to Meal Plan
          </button>

        </div>

        <h3>
          Instructions
        </h3>

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

