import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { Meal } from "./Meal.js";
import { Ingredient } from "./Ingredient.js";

@Entity("meal_ingredients")
export class MealIngredient {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
    })
    measure!: string | null;

    @ManyToOne(
        () => Meal,
        { onDelete: "CASCADE" }
    )
    @JoinColumn({
        name: "meal_id",
    })
    meal!: Meal;

    @ManyToOne(
        () => Ingredient,
        { onDelete: "CASCADE" }
    )
    @JoinColumn({
        name: "ingredient_id",
    })
    ingredient!: Ingredient;
}