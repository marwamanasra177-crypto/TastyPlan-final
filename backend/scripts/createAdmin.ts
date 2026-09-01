import "dotenv/config";
import bcrypt from "bcrypt";

import { AppDataSource } from "../data-source.js";
import { User } from "../entities/User.js";

const createAdmin = async () => {

    await AppDataSource.initialize();

    const userRepository =
        AppDataSource.getRepository(User);

    const email = "admin@tastyplan.com";
    const password = "admin123";
    const name = "TastyPlan Admin";

    const existingAdmin =
        await userRepository.findOne({
            where: { email },
        });

    if (existingAdmin) {
        console.log("Admin already exists");
        process.exit(0);
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const admin = userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
    });

    await userRepository.save(admin);

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    await AppDataSource.destroy();
};

createAdmin();