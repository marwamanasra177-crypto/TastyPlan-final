import type { Meal } from "../types/meal";
export type Day = | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export interface MealPlanState {
    [key: string]: Meal[];
}
export const initialMealPlan: MealPlanState = {
        Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
};
export type MealPlanAction =
    {
        type: "ADD_MEAL";
        payload: {
            day: Day;
            meal: Meal;
        }
    }
    |
    {
        type: "REMOVE_MEAL";
        payload: {
            day: Day;
            id: number;
        }
    }
    |
    {
        type: "CLEAR_WEEK";
    };

export function mealPlanReducer(
    state: MealPlanState,
    action: MealPlanAction
): MealPlanState {
    switch (action.type) {
        case "ADD_MEAL":
            return {
                ...state,
                [action.payload.day]:
                    [
                        ...state[action.payload.day],
                        action.payload.meal
                    ]
            };
        case "REMOVE_MEAL":
            return {
                ...state,
                [action.payload.day]:

                    state[action.payload.day]
                        .filter(
                            meal =>
                                meal.id !== action.payload.id
                        )
            };
        case "CLEAR_WEEK":
            return initialMealPlan;
        default:
            return state;
    }


}