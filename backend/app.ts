import express from "express";
import mealRoutes from "./routes/mealRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import cors from "cors";
import { connectDB } from "./db/mongoose.js";
import { engine } from "express-handlebars";
import path from "path";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";

const app = express();

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",

        layoutsDir: path.join(
            process.cwd(),
            "views/layouts"
        ),

        helpers: {
            eq: (a: any, b: any) => a === b,
        },
    })
);

app.set("view engine", "hbs");

app.set(
    "views",
    path.join(process.cwd(), "views")
);

const PORT =
    Number(process.env.PORT) || 5000;

app.use(
    express.static(
        path.join(process.cwd(), "public")
    )
);

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    "/dashboard",
    dashboardRoutes
);

app.get("/", (req, res) => {

    res.json({
        message:
            "TastyPlan API is running!",
    });

});

app.use(
    "/api/meals",
    mealRoutes
);

app.use(
    "/api",
    dataRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/favorites",
    favoritesRoutes
);

app.use(
    "/api/mealplan",
    mealPlanRoutes
);

connectDB()
    .then(() => {

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.error(
            "Database connection failed:",
            error
        );

    });
