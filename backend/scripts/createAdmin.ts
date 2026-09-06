import "dotenv/config";
import bcrypt from "bcrypt";
import { connectDB } from "../db/mongoose.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";
const createAdmin = async () => {
    await connectDB();
    const email = "admin@tastyplan.com";
    const password = "admin123";
    const name = "TastyPlan Admin";
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
        console.log("Admin already exists");
        await mongoose.disconnect();
        process.exit(0);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
    });
    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);
    await mongoose.disconnect();
};
createAdmin();
