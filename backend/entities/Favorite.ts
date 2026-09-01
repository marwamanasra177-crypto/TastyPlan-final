import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { User } from "./User.js";
import { Meal } from "./Meal.js";

@Entity("favorites")
export class Favorite {

    @PrimaryGeneratedColumn()
    id!: number;

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