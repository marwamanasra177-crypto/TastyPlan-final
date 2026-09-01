
import "./GroceryList.css";
import { useMealPlan } from "../MealPlanContext/MealPlanContext";
import { useState } from "react";

function GroceryList() {

    const { mealPlan } = useMealPlan();

    const [checkedItems, setCheckedItems] =
        useState<string[]>([]);

    const [filter, setFilter] = useState<
        "all" | "remaining" | "completed"
    >("all");

    const [newItem, setNewItem] =
        useState("");

    const [customItems, setCustomItems] =
        useState<string[]>([]);

    const toggleItem = (item: string) => {

        setCheckedItems((prev) => {

            if (prev.includes(item)) {

                return prev.filter(
                    (i) => i !== item
                );

            }

            return [
                ...prev,
                item
            ];

        });

    };

    /*
     * Build grocery list from Meal Plan
     */

    const groceryItems: Record<string, number> = {};

    Object.values(mealPlan).forEach((meals) => {

        meals.forEach((meal) => {
meal.mealIngredients?.forEach((mealIngredient) => {

    const ingredient =
        mealIngredient.ingredient.name;

    const measure =
        mealIngredient.measure;

    const item =
        `${measure ?? ""} ${ingredient}`.trim();

    if (groceryItems[item]) {
        groceryItems[item]++;
    } else {
        groceryItems[item] = 1;
    }

});

        });

    });

    /*
     * Filter grocery items
     */

    const filteredItems =
        Object.entries(groceryItems)
            .filter(([item]) => {

                const isChecked =
                    checkedItems.includes(item);

                if (filter === "completed") {
                    return isChecked;
                }

                if (filter === "remaining") {
                    return !isChecked;
                }

                return true;

            });

    /*
     * Add custom grocery item
     */

    const addCustomItem = () => {

        if (!newItem.trim()) return;

        setCustomItems((prev) => [
            ...prev,
            newItem.trim()
        ]);

        setNewItem("");

    };

    /*
     * Total number of grocery items
     */

    const totalItems =
        filteredItems.length + customItems.length;

    return (

        <div className="grocery-page">

            <div className="grocery-container">

                {/* Header */}

                <div className="grocery-header">

                    <div className="grocery-title">

                        <h1>
                            🛒 Grocery List
                        </h1>

                        <p>
                            Everything you need for your weekly meals
                        </p>

                    </div>

                    <div className="grocery-count">
                        {totalItems} items
                    </div>

                </div>


                {/* Add Custom Item */}

                <div className="add-item">

                    <input
                        type="text"
                        placeholder="Add grocery item..."
                        value={newItem}
                        onChange={(e) =>
                            setNewItem(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                addCustomItem();
                            }

                        }}
                    />

                    <button
                        onClick={addCustomItem}
                    >
                        Add
                    </button>

                </div>


                {/* Filters */}

                <div className="filters">

                    <button
                        onClick={() =>
                            setFilter("all")
                        }
                        className={
                            filter === "all"
                                ? "active"
                                : ""
                        }
                    >
                        All
                    </button>

                    <button
                        onClick={() =>
                            setFilter("remaining")
                        }
                        className={
                            filter === "remaining"
                                ? "active"
                                : ""
                        }
                    >
                        Remaining
                    </button>

                    <button
                        onClick={() =>
                            setFilter("completed")
                        }
                        className={
                            filter === "completed"
                                ? "active"
                                : ""
                        }
                    >
                        Completed
                    </button>

                </div>


                {/* Grocery List */}

                {
                    filteredItems.length === 0 &&
                    customItems.length === 0 ? (

                        <div className="grocery-empty">

                            <div className="grocery-empty-icon">
                                🛒
                            </div>

                            <h2>
                                Your grocery list is empty
                            </h2>

                            <p>
                                Add meals to your weekly plan
                                to generate your grocery list.
                            </p>

                        </div>

                    ) : (

                        <div className="grocery-list">

                            {/* Meal ingredients */}

                            {filteredItems.map(
                                ([item, count]) => {

                                    const isChecked =
                                        checkedItems.includes(item);

                                    return (

                                        <div
                                            key={item}
                                            className={
                                                `grocery-item ${
                                                    isChecked
                                                        ? "checked"
                                                        : ""
                                                }`
                                            }
                                        >

                                            <input
                                                type="checkbox"
                                                className="grocery-checkbox"
                                                checked={isChecked}
                                                onChange={() =>
                                                    toggleItem(item)
                                                }
                                            />

                                            <span className="grocery-ingredient">
                                                {item}
                                            </span>

                                            {
                                                count > 1 && (
                                                    <span className="grocery-quantity">
                                                        ×{count}
                                                    </span>
                                                )
                                            }

                                        </div>

                                    );

                                }
                            )}


                            {/* Custom items */}

                            {customItems.map(
                                (item, index) => {

                                    const isChecked =
                                        checkedItems.includes(item);

                                    return (

                                        <div
                                            key={`custom-${index}`}
                                            className={
                                                `grocery-item ${
                                                    isChecked
                                                        ? "checked"
                                                        : ""
                                                }`
                                            }
                                        >

                                            <input
                                                type="checkbox"
                                                className="grocery-checkbox"
                                                checked={isChecked}
                                                onChange={() =>
                                                    toggleItem(item)
                                                }
                                            />

                                            <span className="grocery-ingredient">
                                                {item}
                                            </span>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )
                }

            </div>

        </div>

    );

}

export default GroceryList;

