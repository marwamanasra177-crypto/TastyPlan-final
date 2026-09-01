import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";

import { Category } from "./Category.js";
import { Area } from "./Area.js";
import { MealIngredient } from "./MealIngredient.js";

@Entity("meals")
export class Meal {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 50,
        unique: true,
    })
    themealdbId!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    name!: string;

    @Column({
        type: "text",
        nullable: true,
    })
    instructions!: string | null;

    @Column({
        type: "varchar",
        length: 500,
        nullable: true,
    })
    image!: string | null;

    @Column({
        type: "varchar",
        length: 500,
        nullable: true,
    })
    youtubeUrl!: string | null;

    @ManyToOne(
        () => Category,
        { nullable: true }
    )
    @JoinColumn({
        name: "category_id",
    })
    category!: Category | null;

    @ManyToOne(
        () => Area,
        { nullable: true }
    )
    @JoinColumn({
        name: "area_id",
    })
    area!: Area | null;

    @OneToMany(
        () => MealIngredient,
        (mealIngredient) => mealIngredient.meal
    )
    mealIngredients!: MealIngredient[];
}