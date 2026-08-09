import "./GroceryList.css";
import { useMealPlan } from "../MealPlanContext/MealPlanContext";
import { useState } from "react";
function GroceryList() {

    const { mealPlan } = useMealPlan();
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [filter, setFilter] = useState<
        "all" | "remaining" | "completed"
    >("all");
    const [newItem, setNewItem] = useState("");
    const [customItems, setCustomItems] = useState<string[]>([]);
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
    const groceryItems: Record<string, number> = {};
    Object.values(mealPlan).forEach((meals) => {
        meals.forEach((meal) => {
            for (let i = 1; i <= 20; i++) {
                const ingredient =
                    meal[`strIngredient${i}`];
                const measure =
                    meal[`strMeasure${i}`];
                if (
                    ingredient &&
                    ingredient.trim() !== ""
                ) {
                    const item =
                        `${measure ?? ""} ${ingredient}`.trim();

                    if (groceryItems[item]) {

                        groceryItems[item]++;

                    }

                    else {

                        groceryItems[item] = 1;

                    }

                }

            }

        });

    });
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
    const addCustomItem = () => {

        if (!newItem.trim()) return;
        setCustomItems((prev) => [
            ...prev,
            newItem.trim()
        ]);
        setNewItem("");
    };
    return (

        <div className="grocery-list">
            <div className="add-item">
                <input
                    type="text"
                    placeholder="Add grocery item..."
                    value={newItem}
                    onChange={(e) =>
                        setNewItem(e.target.value)
                    }
                />
                <button
                    onClick={addCustomItem}
                >
                    Add
                </button>

            </div>
            <div className="filters">

                <button
                    onClick={() => setFilter("all")}
                >
                    All
                </button>


                <button
                    onClick={() => setFilter("remaining")}
                >
                    Remaining
                </button>
                <button
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </button>
            </div>
            <h2>Grocery List</h2>
            {
                groceryItems.length === 0
                    ?
                    <p>No grocery items yet.</p>
                    :
                    filteredItems.map(
                        ([item, count]) => (
                            <div
                                key={item}
                                className="grocery-item"
                            >
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={
                                            checkedItems.includes(item)
                                        }
                                        onChange={() =>
                                            toggleItem(item)
                                        }
                                    />
                                    <span
                                        className={
                                            checkedItems.includes(item)
                                                ? "completed"
                                                : ""
                                        }
                                    >
                                        {item}
                                    </span>
                                </label>
                                {
                                    count > 1 &&
                                    ` ×${count}`
                                }
                            </div>
                        )
                    )
            }
   {
                customItems.map((item) => (
                    <div
                        key={item}
                        className="grocery-item"
                    >
                        <input
                            type="checkbox"
                        />
                        <span>
                            {item}
                        </span>
                    </div>
                ))
            }
        </div>
    );
}

export default GroceryList;