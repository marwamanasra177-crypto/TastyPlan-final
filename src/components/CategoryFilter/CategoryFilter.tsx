import useFetch from "../../hooks/useFetch";
import { categories } from "../../services/mealApi";
import type { CategoriesResponse } from "../../types/meal";
import "./CategoryFilter.css";
                 
interface CategoryFilterProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
    const { data, loading, error } = useFetch<CategoriesResponse>(categories());
    if (loading) return <p>Loading categories...</p>;
    if (error) return <p>{error}</p>;
    return (
    <div className="category-filter">
        <div className="categories">
            <button
                className={selectedCategory === "" ? "active" : ""}
                onClick={() => setSelectedCategory("")}
            >
                All
            </button>
            {data?.categories.map((category) => (
                <button
                    key={category.idCategory}
                    className={
                        selectedCategory === category.strCategory
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setSelectedCategory(category.strCategory)
                    }
                >
                    {category.strCategory}
                </button>
            ))}

        </div>
    </div>
);
}

export default CategoryFilter;