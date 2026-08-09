import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";

import { ThemeProvider } from "./components/Context/Context";

import { FavoritesProvider } 
from "./components/Context/FavoritesContext";

import { MealPlanProvider } 
from "./components/MealPlanContext/MealPlanContext";


createRoot(document.getElementById("root")!).render(

  <ThemeProvider>

    <FavoritesProvider>

      <MealPlanProvider>

        <App />

      </MealPlanProvider>

    </FavoritesProvider>
    
  </ThemeProvider>

);