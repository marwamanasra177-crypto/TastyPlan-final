import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Home from "./pages/Home/Home";
import FavoritesPage from "./pages/Favorites/Favorites";
import MealPlanPage from "./pages/MealPlan/MealPlan";
import GroceryListPage from "./pages/GroceryList/GroceryList";
import { useTheme } from "./components/Context/Context";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicOnlyRoute from "./components/ProtectedRoute/PublicOnlyRoute";
function App() {
    const { theme } = useTheme();

    return (
         <div className={theme}>
         <BrowserRouter>

            <Routes>
<Route
    path="/login"
    element={
        <PublicOnlyRoute>
            <Login />
        </PublicOnlyRoute>
    }
/>

<Route
    path="/register"
    element={
        <PublicOnlyRoute>
            <Register />
        </PublicOnlyRoute>
    }
/>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/favorites"
                    element={
                        <ProtectedRoute>
                            <FavoritesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/meal-plan"
                    element={
                        <ProtectedRoute>
                            <MealPlanPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/grocery-list"
                    element={
                        <ProtectedRoute>
                            <GroceryListPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
         </div>
        
    );
}

export default App;

