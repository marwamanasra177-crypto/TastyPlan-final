import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import type { Meal } from "../../types/meal";
import { useAuth } from "./AuthContext";

const FAVORITES_URL = "http://localhost:5000/api/favorites";

interface FavoritesContextType {
    favorites: Meal[];
    toggleFavorite: (meal: Meal) => void;
    isFavorite: (id: string) => boolean;
    loading: boolean;
}

const FavoritesContext =
    createContext<FavoritesContextType | undefined>(
        undefined
    );

export function FavoritesProvider(
    { children }: { children: React.ReactNode }
) {

    const { user, token } = useAuth();

    const [favorites, setFavorites] = useState<Meal[]>([]);
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

    // Load favorites from the backend whenever the logged-in user changes
    useEffect(() => {

        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const loadFavorites = async () => {

            try {

                const response = await fetch(FAVORITES_URL, {
                    credentials: "include",
                    headers: authHeaders(),
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (!cancelled) {
                    setFavorites(data.meals || []);
                }

            } catch (error) {

                console.error(
                    "Failed to load favorites:",
                    error
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadFavorites();

        return () => {
            cancelled = true;
        };

    }, [user, authHeaders]);

    const toggleFavorite = (meal: Meal) => {

        const exists = favorites.some(
            (item) => item.id === meal.id
        );

        // Update the UI immediately, then sync with the backend
        if (exists) {
            setFavorites(
                favorites.filter(
                    (item) => item.id !== meal.id
                )
            );
        } else {
            setFavorites([...favorites, meal]);
        }

        if (!user) {
            return;
        }

        const sync = async () => {

            try {

                if (exists) {

                    await fetch(
                        `${FAVORITES_URL}/${meal.id}`,
                        {
                            method: "DELETE",
                            credentials: "include",
                            headers: authHeaders(),
                        }
                    );

                } else {

                    await fetch(FAVORITES_URL, {
                        method: "POST",
                        credentials: "include",
                        headers: authHeaders(),
                        body: JSON.stringify({
                            mealId: meal.id,
                        }),
                    });
                }

            } catch (error) {

                console.error(
                    "Failed to sync favorite:",
                    error
                );
            }
        };

        sync();
    };

    const isFavorite = (id: string) => {
        return favorites.some(
            (item) => item.id === id
        );
    };

    return (

        <FavoritesContext.Provider

            value={{
                favorites,
                toggleFavorite,
                isFavorite,
                loading,
            }}

        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {

    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error(
            "Favorites must be used inside FavoritesProvider"
        );
    }

    return context;
}
