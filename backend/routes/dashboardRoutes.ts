import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Category } from "../entities/Category.js";
import { AppDataSource } from "../data-source.js";
import { User } from "../entities/User.js";
import { requireAdmin } from "../middleware/dashboardAuth.js";
import { Area } from "../entities/Area.js";
import { Ingredient } from "../entities/Ingredient.js";
import { Meal } from "../entities/Meal.js";
import { MealIngredient } from "../entities/MealIngredient.js";
const router = Router();

const userRepository = AppDataSource.getRepository(User);

const mealRepository = AppDataSource.getRepository(Meal);

const categoryRepository =
    AppDataSource.getRepository(Category);

const areaRepository =
    AppDataSource.getRepository(Area);

const ingredientRepository =
    AppDataSource.getRepository(Ingredient);

const mealIngredientRepository =
    AppDataSource.getRepository(MealIngredient);
/*
|--------------------------------------------------------------------------
| Login Page
|--------------------------------------------------------------------------
*/

router.get("/login", (req, res) => {

    res.render("login", {
        title: "Admin Login",
        layout: false,
    });

});


/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.render("login", {
                title: "Admin Login",
                layout: false,
                error: "Email and password are required",
            });

        }

        const user = await userRepository.findOne({
            where: { email },
        });

        if (!user) {

            return res.render("login", {
                title: "Admin Login",
                layout: false,
                error: "Invalid email or password",
            });

        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {

            return res.render("login", {
                title: "Admin Login",
                layout: false,
                error: "Invalid email or password",
            });

        }

        if (user.role !== "admin") {

            return res.render("login", {
                title: "Admin Login",
                layout: false,
                error: "You do not have permission to access the dashboard",
            });

        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res
                .status(500)
                .send("JWT secret is not configured");
        }

        const token = jwt.sign(
    {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
    secret,
    {
        expiresIn: "1h",
    }
);


        res.setHeader(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`
        );

        return res.redirect("/dashboard");

    } catch (error) {

        console.error(error);

        return res.status(500).render("login", {
            title: "Admin Login",
            layout: false,
            error: "Login failed",
        });

    }

});


/*
|--------------------------------------------------------------------------
| Dashboard Home
|--------------------------------------------------------------------------
*/

router.get("/", requireAdmin, async (req, res) => {

    const usersCount = await userRepository.count();

    res.render("dashboard", {
        title: "Dashboard",
        admin: res.locals.admin,
        usersCount,
    });

});

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

router.get("/users", requireAdmin, async (req, res) => {

    try {

        const users = await userRepository.find({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            order: {
                createdAt: "DESC",
            },
        });

        res.render("users", {
            title: "Users",
            admin: res.locals.admin,
            users,
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load users");

    }

});
/*
|--------------------------------------------------------------------------
| Add User Page
|--------------------------------------------------------------------------
*/

router.get("/users/new", requireAdmin, (req, res) => {

    res.render("user-form", {
        title: "Add User",
        admin: res.locals.admin,
        isCreate: true,
        isEdit: false,
        user: {
            name: "",
            email: "",
            isUser: true,
            isAdmin: false,
        },
    });

});


/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

router.post("/users", requireAdmin, async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
        } = req.body;


        if (!name || !email || !password || !role) {

            return res.status(400).render("user-form", {

                title: "Add User",

                pageTitle: "Add User",

                pageDescription: "Create a new user",

                formAction: "/dashboard/users",

                submitText: "Create User",

                passwordPlaceholder: "Enter password",

                error: "All fields are required",

                user: {
                    name,
                    email,
                    isUser: role === "user",
                    isAdmin: role === "admin",
                },

            });

        }


        if (role !== "user" && role !== "admin") {

            return res.status(400).send("Invalid role");

        }


        const existingUser =
            await userRepository.findOne({
                where: { email },
            });


        if (existingUser) {

            return res.status(409).render("user-form", {

                title: "Add User",

                pageTitle: "Add User",

                pageDescription: "Create a new user",

                formAction: "/dashboard/users",

                submitText: "Create User",

                passwordPlaceholder: "Enter password",

                error: "Email already exists",

                user: {
                    name,
                    email,
                    isUser: role === "user",
                    isAdmin: role === "admin",
                },

            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = userRepository.create({

            name,

            email,

            password: hashedPassword,

            role,

        });


        await userRepository.save(user);


        res.redirect("/dashboard/users");

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to create user");

    }

});


/*
|--------------------------------------------------------------------------
| Edit User - Page
|--------------------------------------------------------------------------
*/

router.get("/users/:id/edit", requireAdmin, async (req, res) => {

    try {

        const id = Number(req.params.id);

        const user = await userRepository.findOne({
            where: { id },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

     res.render("user-form", {
    title: "Edit User",
    admin: res.locals.admin,
    isEdit: true,
    user,
    isAdmin: user.role === "admin",
});

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load user");

    }

});


/*
|--------------------------------------------------------------------------
| Edit User
|--------------------------------------------------------------------------
*/

router.post("/users/:id/edit", requireAdmin, async (req, res) => {

    try {

        const id = Number(req.params.id);

        const { name, email, password, role } = req.body;

        const user = await userRepository.findOne({
            where: { id },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.name = name;
        user.email = email;
        user.role = role;

        // Only change password if a new one was entered
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await userRepository.save(user);

        res.redirect("/dashboard/users");

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to update user");

    }

});


/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

router.post("/users/:id/delete", requireAdmin, async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Prevent admin from deleting themselves
        if (id === res.locals.admin.id) {
            return res.status(400).send(
                "You cannot delete your own account"
            );
        }

        const user = await userRepository.findOne({
            where: { id },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        await userRepository.remove(user);

        res.redirect("/dashboard/users");

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to delete user");

    }

});

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

// Categories List

router.get("/categories", requireAdmin, async (req, res) => {

    try {

        const categoryRepository =
            AppDataSource.getRepository(Category);

        const categories = await categoryRepository.find({
            order: {
                id: "ASC",
            },
        });

        res.render("categories", {
            title: "Categories",
            admin: res.locals.admin,
            categories,
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load categories");

    }

});


// Add Category - Page

router.get("/categories/new", requireAdmin, (req, res) => {

    res.render("category-form", {
        title: "Add Category",
        admin: res.locals.admin,
        isCreate: true,
    });

});


// Add Category

router.post("/categories", requireAdmin, async (req, res) => {

    try {

        const { name, image, description } = req.body;

        if (!name) {
            return res.status(400).send("Category name is required");
        }

        const categoryRepository =
            AppDataSource.getRepository(Category);

        const existingCategory =
            await categoryRepository.findOne({
                where: { name },
            });

        if (existingCategory) {
            return res.status(409).send("Category already exists");
        }

        const category = categoryRepository.create({
            name,
            image: image || null,
            description: description || null,
        });

        await categoryRepository.save(category);

        res.redirect("/dashboard/categories");

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to create category");

    }

});


// Edit Category - Page

router.get(
    "/categories/:id/edit",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const categoryRepository =
                AppDataSource.getRepository(Category);

            const category =
                await categoryRepository.findOne({
                    where: { id },
                });

            if (!category) {
                return res.status(404).send("Category not found");
            }

            res.render("category-form", {
                title: "Edit Category",
                admin: res.locals.admin,
                isEdit: true,
                category,
            });

        } catch (error) {

            console.error(error);

            res.status(500).send("Failed to load category");

        }

    }
);


// Edit Category

router.post(
    "/categories/:id/edit",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const { name, image, description } = req.body;

            if (!name) {
                return res.status(400).send(
                    "Category name is required"
                );
            }

            const categoryRepository =
                AppDataSource.getRepository(Category);

            const category =
                await categoryRepository.findOne({
                    where: { id },
                });

            if (!category) {
                return res.status(404).send("Category not found");
            }

            category.name = name;
            category.image = image || null;
            category.description = description || null;

            await categoryRepository.save(category);

            res.redirect("/dashboard/categories");

        } catch (error) {

            console.error(error);

            res.status(500).send("Failed to update category");

        }

    }
);


// Delete Category

router.post(
    "/categories/:id/delete",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const categoryRepository =
                AppDataSource.getRepository(Category);

            const category =
                await categoryRepository.findOne({
                    where: { id },
                });

            if (!category) {
                return res.status(404).send("Category not found");
            }

            await categoryRepository.remove(category);

            res.redirect("/dashboard/categories");

        } catch (error) {

            console.error(error);

            res.status(500).send("Failed to delete category");

        }

    }
);

/*
|--------------------------------------------------------------------------
| Areas
|--------------------------------------------------------------------------
*/

// Areas List

router.get("/areas", requireAdmin, async (req, res) => {

    try {

        const areaRepository =
            AppDataSource.getRepository(Area);

        const areas = await areaRepository.find({
            order: {
                id: "ASC",
            },
        });

        res.render("areas", {
            title: "Areas",
            admin: res.locals.admin,
            areas,
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load areas");

    }

});


// Add Area - Page

router.get("/areas/new", requireAdmin, (req, res) => {

    res.render("area-form", {
        title: "Add Area",
        admin: res.locals.admin,
        isCreate: true,
    });

});


// Add Area

router.post("/areas", requireAdmin, async (req, res) => {

    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).send("Area name is required");
        }

        const areaRepository =
            AppDataSource.getRepository(Area);

        const existingArea =
            await areaRepository.findOne({
                where: { name },
            });

        if (existingArea) {
            return res.status(409).send("Area already exists");
        }

        const area = areaRepository.create({
            name,
        });

        await areaRepository.save(area);

        res.redirect("/dashboard/areas");

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to create area");

    }

});


// Edit Area - Page

router.get(
    "/areas/:id/edit",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const areaRepository =
                AppDataSource.getRepository(Area);

            const area =
                await areaRepository.findOne({
                    where: { id },
                });

            if (!area) {
                return res.status(404).send("Area not found");
            }

            res.render("area-form", {
                title: "Edit Area",
                admin: res.locals.admin,
                isEdit: true,
                area,
            });

        } catch (error) {

            console.error(error);

            res.status(500).send("Failed to load area");

        }

    }
);


// Edit Area

router.post(
    "/areas/:id/edit",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const { name } = req.body;

            if (!name) {
                return res.status(400).send("Area name is required");
            }

            const areaRepository =
                AppDataSource.getRepository(Area);

            const area =
                await areaRepository.findOne({
                    where: { id },
                });

            if (!area) {
                return res.status(404).send("Area not found");
            }

            area.name = name;

            await areaRepository.save(area);

            res.redirect("/dashboard/areas");

        } catch (error) {

            console.error(error);

            res.status(500).send("Failed to update area");

        }

    }
);


// Delete Area

router.post(
    "/areas/:id/delete",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const areaRepository =
                AppDataSource.getRepository(Area);

            const area =
                await areaRepository.findOne({
                    where: { id },
                });

            if (!area) {
                return res.status(404).send("Area not found");
            }

            await areaRepository.remove(area);

            res.redirect("/dashboard/areas");

        } catch (error) {

            console.error(error);

            res.status(500).send("Failed to delete area");

        }

    }
);
/*
|--------------------------------------------------------------------------
| Ingredients
|--------------------------------------------------------------------------
*/

// Ingredients List

router.get("/ingredients", requireAdmin, async (req, res) => {

    try {

        const ingredientRepository =
            AppDataSource.getRepository(Ingredient);

        const ingredients = await ingredientRepository.find({
            order: {
                id: "ASC",
            },
        });

        res.render("ingredients", {
            title: "Ingredients",
            admin: res.locals.admin,
            ingredients,
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load ingredients");

    }

});


// Add Ingredient - Page

router.get("/ingredients/new", requireAdmin, (req, res) => {

    res.render("ingredient-form", {
        title: "Add Ingredient",
        admin: res.locals.admin,
        isCreate: true,
    });

});


// Add Ingredient

router.post("/ingredients", requireAdmin, async (req, res) => {

    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).send(
                "Ingredient name is required"
            );
        }

        const ingredientRepository =
            AppDataSource.getRepository(Ingredient);

        const existingIngredient =
            await ingredientRepository.findOne({
                where: { name },
            });

        if (existingIngredient) {
            return res.status(409).send(
                "Ingredient already exists"
            );
        }

        const ingredient =
            ingredientRepository.create({
                name,
            });

        await ingredientRepository.save(ingredient);

        res.redirect("/dashboard/ingredients");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to create ingredient"
        );

    }

});


// Edit Ingredient - Page

router.get(
    "/ingredients/:id/edit",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const ingredientRepository =
                AppDataSource.getRepository(Ingredient);

            const ingredient =
                await ingredientRepository.findOne({
                    where: { id },
                });

            if (!ingredient) {
                return res.status(404).send(
                    "Ingredient not found"
                );
            }

            res.render("ingredient-form", {
                title: "Edit Ingredient",
                admin: res.locals.admin,
                isEdit: true,
                ingredient,
            });

        } catch (error) {

            console.error(error);

            res.status(500).send(
                "Failed to load ingredient"
            );

        }

    }
);


// Edit Ingredient

router.post(
    "/ingredients/:id/edit",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const { name } = req.body;

            if (!name) {
                return res.status(400).send(
                    "Ingredient name is required"
                );
            }

            const ingredientRepository =
                AppDataSource.getRepository(Ingredient);

            const ingredient =
                await ingredientRepository.findOne({
                    where: { id },
                });

            if (!ingredient) {
                return res.status(404).send(
                    "Ingredient not found"
                );
            }

            ingredient.name = name;

            await ingredientRepository.save(ingredient);

            res.redirect("/dashboard/ingredients");

        } catch (error) {

            console.error(error);

            res.status(500).send(
                "Failed to update ingredient"
            );

        }

    }
);


// Delete Ingredient

router.post(
    "/ingredients/:id/delete",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const ingredientRepository =
                AppDataSource.getRepository(Ingredient);

            const ingredient =
                await ingredientRepository.findOne({
                    where: { id },
                });

            if (!ingredient) {
                return res.status(404).send(
                    "Ingredient not found"
                );
            }

            await ingredientRepository.remove(ingredient);

            res.redirect("/dashboard/ingredients");

        } catch (error) {

            console.error(error);

            res.status(500).send(
                "Failed to delete ingredient"
            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| Meals
|--------------------------------------------------------------------------
*/

// Meals List

router.get("/meals", requireAdmin, async (req, res) => {

    try {

        const meals = await mealRepository.find({
            relations: {
                category: true,
                area: true,
            },
            order: {
                id: "ASC",
            },
        });

        res.render("meals", {
            title: "Meals",
            admin: res.locals.admin,
            meals,
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load meals");

    }

});
router.get("/meals/new", requireAdmin, async (req, res) => {

    try {

        const categories = await categoryRepository.find({
            order: {
                name: "ASC",
            },
        });

        const areas = await areaRepository.find({
            order: {
                name: "ASC",
            },
        });

        const ingredients = await ingredientRepository.find({
            order: {
                name: "ASC",
            },
        });

        res.render("meal-form", {
            title: "Add Meal",
            admin: res.locals.admin,
            isCreate: true,
            categories,
            areas,
            ingredients,
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load meal form");

    }

});
/*
|--------------------------------------------------------------------------
| Create Meal
|--------------------------------------------------------------------------
*/

router.post("/meals", requireAdmin, async (req, res) => {

    try {

        const {
            name,
            themealdbId,
            image,
            youtubeUrl,
            instructions,
            categoryId,
            areaId,
            ingredientIds,
        } = req.body;


        // Validate required fields

        if (!name || !themealdbId) {

            return res.status(400).send(
                "Meal name and TheMealDB ID are required"
            );

        }


        // Check if TheMealDB ID already exists

        const existingMeal = await mealRepository.findOne({
            where: {
                themealdbId,
            },
        });


        if (existingMeal) {

            return res.status(409).send(
                "A meal with this TheMealDB ID already exists"
            );

        }


        // Find Category

        let category = null;

        if (categoryId) {

            category = await categoryRepository.findOne({
                where: {
                    id: Number(categoryId),
                },
            });

            if (!category) {

                return res.status(404).send(
                    "Category not found"
                );

            }

        }


        // Find Area

        let area = null;

        if (areaId) {

            area = await areaRepository.findOne({
                where: {
                    id: Number(areaId),
                },
            });

            if (!area) {

                return res.status(404).send(
                    "Area not found"
                );

            }

        }


        // Create Meal

        const meal = mealRepository.create({

            name,

            themealdbId,

            image: image || null,

            youtubeUrl: youtubeUrl || null,

            instructions: instructions || null,

            category,

            area,

        });


        await mealRepository.save(meal);


        // Add Ingredients

        if (ingredientIds) {

            const ids = Array.isArray(ingredientIds)
                ? ingredientIds
                : [ingredientIds];


            for (const ingredientId of ids) {

                const ingredient =
                    await ingredientRepository.findOne({
                        where: {
                            id: Number(ingredientId),
                        },
                    });


                if (!ingredient) {
                    continue;
                }


                const measure =
                    req.body[`measure_${ingredientId}`] || null;


                const mealIngredient =
                    mealIngredientRepository.create({

                        meal,

                        ingredient,

                        measure,

                    });


                await mealIngredientRepository.save(
                    mealIngredient
                );

            }

        }


        // Redirect to Meals page

        res.redirect("/dashboard/meals");


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to create meal"
        );

    }

});
/*
|--------------------------------------------------------------------------
| Edit Meal - Page
|--------------------------------------------------------------------------
*/

router.get("/meals/:id/edit", requireAdmin, async (req, res) => {

    try {

        const id = Number(req.params.id);

        const meal = await mealRepository.findOne({
            where: {
                id,
            },
            relations: {
                category: true,
                area: true,
                mealIngredients: {
                    ingredient: true,
                },
            },
        });


        if (!meal) {

            return res.status(404).send(
                "Meal not found"
            );

        }


        const categories = await categoryRepository.find({
            order: {
                name: "ASC",
            },
        });


        const areas = await areaRepository.find({
            order: {
                name: "ASC",
            },
        });


        const ingredients = await ingredientRepository.find({
            order: {
                name: "ASC",
            },
        });


        // Prepare ingredients with their measures

        const mealIngredientsMap =
            new Map<number, string | null>();


        for (const mealIngredient of meal.mealIngredients) {

            mealIngredientsMap.set(
                mealIngredient.ingredient.id,
                mealIngredient.measure
            );

        }


        const ingredientsWithData =
            ingredients.map((ingredient) => ({

                ...ingredient,

                selected:
                    mealIngredientsMap.has(ingredient.id),

                measure:
                    mealIngredientsMap.get(ingredient.id) || "",

            }));


        res.render("meal-form", {

            title: "Edit Meal",

            admin: res.locals.admin,

            isEdit: true,

            meal,

            categories,

            areas,

            ingredients: ingredientsWithData,

        });


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to load meal"
        );

    }

});

/*
|--------------------------------------------------------------------------
| Edit Meal
|--------------------------------------------------------------------------
*/

router.post(
    "/meals/:id/edit",
    requireAdmin,
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            const {
                name,
                themealdbId,
                image,
                youtubeUrl,
                instructions,
                categoryId,
                areaId,
                ingredientIds,
            } = req.body;


            // Find meal

            const meal =
                await mealRepository.findOne({
                    where: { id },
                });


            if (!meal) {

                return res.status(404).send(
                    "Meal not found"
                );

            }


            // Validate required fields

            if (!name || !themealdbId) {

                return res.status(400).send(
                    "Meal name and TheMealDB ID are required"
                );

            }


            // Check duplicate TheMealDB ID

            const existingMeal =
                await mealRepository.findOne({
                    where: {
                        themealdbId,
                    },
                });


            if (
                existingMeal &&
                existingMeal.id !== meal.id
            ) {

                return res.status(409).send(
                    "A meal with this TheMealDB ID already exists"
                );

            }


            // Find Category

            let category = null;

            if (categoryId) {

                category =
                    await categoryRepository.findOne({
                        where: {
                            id: Number(categoryId),
                        },
                    });


                if (!category) {

                    return res.status(404).send(
                        "Category not found"
                    );

                }

            }


            // Find Area

            let area = null;

            if (areaId) {

                area =
                    await areaRepository.findOne({
                        where: {
                            id: Number(areaId),
                        },
                    });


                if (!area) {

                    return res.status(404).send(
                        "Area not found"
                    );

                }

            }


            // Update meal

            meal.name = name;

            meal.themealdbId = themealdbId;

            meal.image =
                image || null;

            meal.youtubeUrl =
                youtubeUrl || null;

            meal.instructions =
                instructions || null;

            meal.category =
                category;

            meal.area =
                area;


            await mealRepository.save(meal);


            // Remove old ingredients

            await mealIngredientRepository.delete({
                meal: {
                    id: meal.id,
                },
            });


            // Add updated ingredients

            if (ingredientIds) {

                const ids =
                    Array.isArray(ingredientIds)
                        ? ingredientIds
                        : [ingredientIds];


                for (const ingredientId of ids) {

                    const ingredient =
                        await ingredientRepository.findOne({
                            where: {
                                id: Number(ingredientId),
                            },
                        });


                    if (!ingredient) {
                        continue;
                    }


                    const measure =
                        req.body[
                            `measure_${ingredientId}`
                        ] || null;


                    const mealIngredient =
                        mealIngredientRepository.create({

                            meal,

                            ingredient,

                            measure,

                        });


                    await mealIngredientRepository.save(
                        mealIngredient
                    );

                }

            }


            res.redirect("/dashboard/meals");

        } catch (error) {

            console.error(error);

            res.status(500).send(
                "Failed to update meal"
            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| Delete Meal
|--------------------------------------------------------------------------
*/

router.post(
    "/meals/:id/delete",
    requireAdmin,
    async (req, res) => {

        try {

            const id =
                Number(req.params.id);


            const meal =
                await mealRepository.findOne({
                    where: { id },
                });


            if (!meal) {

                return res.status(404).send(
                    "Meal not found"
                );

            }


            // Delete related meal ingredients first

            await mealIngredientRepository.delete({
                meal: {
                    id: meal.id,
                },
            });


            // Delete meal

            await mealRepository.remove(meal);


            res.redirect(
                "/dashboard/meals"
            );

        } catch (error) {

            console.error(error);

            res.status(500).send(
                "Failed to delete meal"
            );

        }

    }
);
/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/



router.get("/logout", (req, res) => {

    res.setHeader(
        "Set-Cookie",
        "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
    );

    res.redirect("/dashboard/login");

});


export default router;