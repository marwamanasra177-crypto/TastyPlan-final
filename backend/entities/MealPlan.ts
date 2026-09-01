import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { User } from "./User.js";
import { Meal } from "./Meal.js";

@Entity("meal_plans")
export class MealPlan {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 20,
    })
    day!: string;

    @ManyToOne(
        () => User,
        { onDelete: "CASCADE" }
    )
    @JoinColumn({
        name: "user_id",
    })
    user!: User;

    @ManyToOne(
        () => Meal,
        { onDelete: "CASCADE" }
    )
    @JoinColumn({
        name: "meal_id",
    })
    meal!: Meal;

    @CreateDateColumn()
    createdAt!: Date;
}
