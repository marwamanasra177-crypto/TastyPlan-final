import { useState } from "react";
import GroceryList from "../../components/GroceryList/GroceryList";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import useDebounce from "../../hooks/useDebounce";
function GroceryListPage() {
        const [search, setSearch] = useState("");
        const debouncedSearch = useDebounce(search, 500);

    return (
        <div>
            <Header />
                        <SearchBar setSearch={setSearch} />

            <GroceryList />
        </div>
    );
}

export default GroceryListPage;