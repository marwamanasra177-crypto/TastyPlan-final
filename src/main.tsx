import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App";
import { ThemeProvider } from "./components/Context/Context";
// import { FavoritesProvider } 
// from "./components/Context/FavoritesContext";
import { MealPlanProvider } from "../src/components/MealPlanContext/MealPlanContext";


createRoot(document.getElementById("root")!).render(
  <ThemeProvider>

<MealPlanProvider>

<App />

</MealPlanProvider>

</ThemeProvider>
);


