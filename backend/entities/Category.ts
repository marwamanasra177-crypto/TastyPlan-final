import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("categories")
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 100,
        unique: true,
    })
    name!: string;

    @Column({
        type: "varchar",
        length: 500,
        nullable: true,
    })
    image!: string | null;

    @Column({
        type: "text",
        nullable: true,
    })
    description!: string | null;
}