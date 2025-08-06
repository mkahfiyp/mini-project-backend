import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

class AuthMiddleware {
    public verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                throw {
                    success: false,
                    message: "Token not found",
                };
            }

            const checkToken = verify(token, process.env.TOKEN_KEY || "secret");
            res.locals.decript = checkToken;
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthMiddleware();