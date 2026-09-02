import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";

import {
    mealPlanReducer,
    initialMealPlan
} from "../../reducer/mealPlanReducer";

import type {
    MealPlanState,
    MealPlanAction
} from "../../reducer/mealPlanReducer";

import { useAuth } from "../Context/AuthContext";

const MEALPLAN_URL = "http://localhost:5000/api/mealplan";

interface MealPlanContextType {

    mealPlan: MealPlanState;

    dispatch: React.Dispatch<MealPlanAction>;

    loading: boolean;

}

const MealPlanContext =
    createContext<MealPlanContextType | undefined>(
        undefined
    );

export function MealPlanProvider(
    {
        children
    }: {
        children: React.ReactNode;
    }
) {

    const { user, token } = useAuth();

    const [
        mealPlan,
        rawDispatch
    ] = useReducer(
        mealPlanReducer,
        initialMealPlan
    );

    const [loading, setLoading] = useState(true);

    const authHeaders = useCallback((): HeadersInit => {

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;

    }, [token]);

    // Load the meal plan from the backend whenever the logged-in user changes
    useEffect(() => {

        if (!user) {
            rawDispatch({
                type: "SET_PLAN",
                payload: initialMealPlan,
            });
            setLoading(false);
            return;
        }

        let cancelled = false;

        const loadPlan = async () => {

            try {

                const response = await fetch(MEALPLAN_URL, {
                    credentials: "include",
                    headers: authHeaders(),
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (!cancelled) {
                    rawDispatch({
                        type: "SET_PLAN",
                        payload: data.mealPlan || initialMealPlan,
                    });
                }

            } catch (error) {

                console.error(
                    "Failed to load meal plan:",
                    error
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadPlan();

        return () => {
            cancelled = true;
        };

    }, [user, authHeaders]);

    // Wraps the reducer's dispatch so every action also syncs to the backend,
    // while keeping the exact same dispatch(action) signature everywhere else
    const dispatch: React.Dispatch<MealPlanAction> = (action) => {

        rawDispatch(action);

        if (!user) {
            return;
        }

        const sync = async () => {

            try {

                if (action.type === "ADD_MEAL") {

                    await fetch(MEALPLAN_URL, {
                        method: "POST",
                        credentials: "include",
                        headers: authHeaders(),
                        body: JSON.stringify({
                            day: action.payload.day,
                            mealId: action.payload.meal.id,
                        }),
                    });

                } else if (action.type === "REMOVE_MEAL") {

                    await fetch(
                        `${MEALPLAN_URL}/${action.payload.day}/${action.payload.id}`,
                        {
                            method: "DELETE",
                            credentials: "include",
                            headers: authHeaders(),
                        }
                    );

                } else if (action.type === "CLEAR_WEEK") {

                    await fetch(MEALPLAN_URL, {
                        method: "DELETE",
                        credentials: "include",
                        headers: authHeaders(),
                    });
                }

            } catch (error) {

                console.error(
                    "Failed to sync meal plan:",
                    error
                );
            }
        };

        sync();
    };

    return (

        <MealPlanContext.Provider
            value={{
                mealPlan,
                dispatch,
                loading,
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
