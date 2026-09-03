import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error(
        "MONGO_URI environment variable is missing"
    );
}

export async function connectDB() {

    mongoose.set("strictQuery", true);

    await mongoose.connect(MONGO_URI as string);

    console.log("MongoDB connected successfully");

}

export default mongoose;
