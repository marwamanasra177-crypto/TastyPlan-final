import MealPlanner from "../../components/MealPlanner/MealPlanner";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
function MealPlanPage() {
                const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    return (
        <div>
            <Header />
                        <SearchBar setSearch={setSearch} />

            <MealPlanner />
        </div>
    );
}

export default MealPlanPage;