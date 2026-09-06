import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
const router = Router();
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Registration failed",
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                message: "JWT secret is not configured",
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            secret,
            {
                expiresIn: "1h",
            }
        );
        // Store JWT in HttpOnly Cookie
        res.setHeader(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`
        );
        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Login failed",
        });
    }
});
router.get("/me", async (req, res) => {
    try {
        // Accept the token either from the HttpOnly cookie
        // or from an "Authorization: Bearer <token>" header.
        let token: string | undefined;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.slice("Bearer ".length);
        }
        if (!token) {
            const cookieHeader = req.headers.cookie;
            const tokenCookie = cookieHeader
                ?.split(";")
                .find((cookie) => cookie.trim().startsWith("token="));
            if (tokenCookie) {
                token = tokenCookie
                    .split("=")
                    .slice(1)
                    .join("=");
            }
        }
        if (!token) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                message: "JWT secret is not configured",
            });
        }
        const decoded = jwt.verify(token, secret) as {
            id: string;
            email: string;
            role: "user" | "admin";
        };
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
});
router.post("/logout", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
    );
    return res.json({
        message: "Logout successful",
    });
});
export default router;
