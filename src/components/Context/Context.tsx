import { createContext, useContext, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";


type Theme = "light" | "dark";
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
const [theme, setTheme] =
    useLocalStorage<Theme>(
        "theme",
        "light"
    );    const toggleTheme = () => {
        setTheme((prev) =>
            prev === "light" ? "dark" : "light"
        );
    };
    return (
        <ThemeContext.Provider 
            value={{ theme, toggleTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }


    return context;
}