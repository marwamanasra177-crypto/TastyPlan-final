import {createContext,useContext,useReducer} from "react";
import {mealPlanReducer, initialMealPlan} from "../../reducer/mealPlanReducer";
import type {  MealPlanState,MealPlanAction} from "../../reducer/mealPlanReducer";

interface MealPlanContextType {
  mealPlan: MealPlanState;
  dispatch: React.Dispatch<MealPlanAction>;
}
const MealPlanContext =
  createContext<MealPlanContextType | undefined>(undefined);
export function MealPlanProvider(
  {
    children
  }: {
    children: React.ReactNode;
  }
) {
  const [mealPlan, dispatch] =
    useReducer(
      mealPlanReducer,
      initialMealPlan
    );
  return (

    <MealPlanContext.Provider
      value={{
        mealPlan,
        dispatch
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}
export function useMealPlan() {
  const context =
    useContext(MealPlanContext);
  if (!context) {
    throw new Error(
      "useMealPlan must be used inside MealPlanProvider"
    );
  }
  return context;

}