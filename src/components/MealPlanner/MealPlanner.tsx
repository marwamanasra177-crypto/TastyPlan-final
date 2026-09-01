import "./MealPlanner.css";
import { useMealPlan } from "../MealPlanContext/MealPlanContext";
import type { Day } from "../../reducer/mealPlanReducer";
function MealPlanner() {

const { mealPlan, dispatch } = useMealPlan();
    return (
        <div className="meal-planner">

            <h2>Weekly Meal Planner</h2>
<button
    className="clear-week"
    onClick={() =>
        dispatch({
            type: "CLEAR_WEEK",
        })
    }
>
    Clear Week
</button>
            <div className="planner-grid">

                {Object.entries(mealPlan).map(([day, meals]) => (

                    <div
                        key={day}
                        className="day-card"
                    >

                        <h3>{day}</h3>

                        {
                            meals.length === 0
                                ? (
                                    <p>No meals planned</p>
                                )
                                : (
                                    meals.map((meal) => (
    <div
        key={meal.id}
        className="meal-item"
    >
        <span>{meal.name}</span>

        <button
            onClick={() =>
                dispatch({
                    type: "REMOVE_MEAL",
                    payload: {
                        day: day as Day,
                        id: meal.id,
                    },
                })
            }
        >
            ❌
        </button>
    </div>
))
                                )
                        }

                    </div>

                ))}

            </div>

        </div>
    );

}

export default MealPlanner;