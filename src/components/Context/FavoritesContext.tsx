import {createContext,useContext,useState} from "react";

import type { Meal } from "../../types/meal";
import useLocalStorage from "../../hooks/useLocalStorage";
interface FavoritesContextType {
    favorites: Meal[];
    toggleFavorite: (meal: Meal) => void;
    isFavorite: (id: string) => boolean;
}
const FavoritesContext =
    createContext<FavoritesContextType | undefined>(
        undefined
    );

export function FavoritesProvider(
    { children }: { children: React.ReactNode }
) {
   const [favorites, setFavorites] =
    useLocalStorage<Meal[]>(
        "favorites",
        []
    );
    const toggleFavorite = (meal: Meal) => {
        const exists =
            favorites.some(
                (item) => item.idMeal === meal.idMeal
            );
        if (exists) {

            setFavorites(
                favorites.filter(
                    (item) => item.idMeal !== meal.idMeal
                )
            );

        }
        else {

            setFavorites(
                [
                    ...favorites,
                    meal
                ]
            );
        }
    };
    const isFavorite = (id: string) => {
        return favorites.some(
            (item) => item.idMeal === id
        );

    };
    return (

        <FavoritesContext.Provider

            value={{
                 favorites,
                toggleFavorite,
                isFavorite
            }}

        >
            {children}
        </FavoritesContext.Provider>
    );
}
export function useFavorites() {
    const context =
        useContext(FavoritesContext);
    if (!context) {
        throw new Error(
        "Favorites must be used inside FavoritesProvider"
        );
    }
    return context;
}