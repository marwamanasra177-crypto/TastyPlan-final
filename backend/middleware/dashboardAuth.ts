import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const token = req.headers.cookie
    ?.split("; ")
    .find(cookie => cookie.startsWith("token="))
    ?.substring("token=".length);

        if (!token) {
            return res.redirect("/dashboard/login");
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).send("JWT secret is not configured");
        }

        const decoded = jwt.verify(
            token,
            secret
        ) as AuthPayload;

        if (decoded.role !== "admin") {
            return res.status(403).send("Access denied");
        }

        res.locals.admin = decoded;

        next();

    } catch (error) {

        return res.redirect("/dashboard/login");

    }
};