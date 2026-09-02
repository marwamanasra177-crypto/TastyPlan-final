import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
    userId?: number;
    userRole?: "user" | "admin";
}

export function requireAuth(
    req: AuthedRequest,
    res: Response,
    next: NextFunction
) {

    try {

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
            id: number;
            role: "user" | "admin";
        };

        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}
