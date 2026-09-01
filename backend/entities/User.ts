import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 100,
    })
    name!: string;

    @Column({
        type: "varchar",
        length: 150,
        unique: true,
    })
    email!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    password!: string;

    @Column({
        type: "varchar",
        length: 20,
        default: "user",
    })
    role!: "user" | "admin";

    @CreateDateColumn()
    createdAt!: Date;
}