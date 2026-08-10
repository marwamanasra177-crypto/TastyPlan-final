import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Home from "./pages/Home/Home";
import FavoritesPage from "./pages/Favorites/Favorites";
import MealPlanPage from "./pages/MealPlan/MealPlan";
import GroceryListPage from "./pages/GroceryList/GroceryList";
import { useTheme } from "./components/Context/Context";

function App() {
    const { theme } = useTheme();

    return (
         <div className={theme}>
         <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/favorites"
                    element={<FavoritesPage />}
                />
                <Route
                    path="/meal-plan"
                    element={<MealPlanPage />}
                />
                <Route
                    path="/grocery-list"
                    element={<GroceryListPage />}
                />

            </Routes>

        </BrowserRouter>
         </div>
        
    );
}

export default App;

