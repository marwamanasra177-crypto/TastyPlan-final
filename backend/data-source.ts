import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

if (
    !DB_HOST ||
    !DB_PORT ||
    !DB_USER ||
    !DB_PASSWORD ||
    !DB_NAME
) {
    throw new Error(
        "Database environment variables are missing"
    );
}

export const AppDataSource = new DataSource({
    type: "mysql",

    host: DB_HOST,
    port: Number(DB_PORT),

    username: DB_USER,
    password: DB_PASSWORD,

    database: DB_NAME,

    synchronize: true,
    logging: false,

    entities: ["./entities/*.ts"],
});