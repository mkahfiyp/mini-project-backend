import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { compare } from "bcrypt";
import hashPassword from "../utils/hash";
import { sign } from "jsonwebtoken";

class AuthController {
    public async register(req: Request, res: Response) {
        try {
            const { name, username, email, password, phone, referal_code, profile_picture } = req.body;

            const existingEmail = await prisma.users.findUnique({ where: { email } });
            if (existingEmail) return res.status(400).send({ message: "Email already registered" });

            const existingUsername = await prisma.users.findUnique({ where: { username } });
            if (existingUsername) return res.status(400).send({ message: "Username already registered" });

            // const hashedPassword = await bcrypt.hash(password, 10);
            const hashedPassword = await hashPassword.hashPassword(password);
            const user = await prisma.users.create({
                data: {
                    name,
                    username,
                    email,
                    password: hashedPassword,
                    phone,
                    referal_code,
                    profile_picture,
                },
            });
            res.status(201).send({ message: "Register success", user });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async loginUser(req: Request, res: Response) {
        try {
            // const { email, password } = req.body;
            // const user = await prisma.users.findUnique({ where: { email } });
            // if (!user) return res.status(404).send({ message: "User not found" });

            // const isValid = await compare(password, user.password);
            // if (!isValid) return res.status(401).send({ message: "Invalid credentials" });

            // const token = createToken({ user_id: user.user_id, role: user.role }, "1d");
            // res.status(200).send({ message: "Login success", token, user });
            const { email, password } = req.body;

            const user = await prisma.users.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).send({ success: false, message: "Account does not exist" });
            }

            const isValid = await compare(password, user.password);
            if (!isValid) {
                return res.status(401).send({ success: false, message: "Password is wrong" });
            }

            const token = sign(
                { id: user.user_id, role: user.role },
                process.env.TOKEN_KEY || "secret",
            );

            res.status(200).send({
                success: true,
                result: {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    point: user.points,
                    token,
                },
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async keepLogin(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.id;
            if (!userId) return res.status(401).send({ message: "Unauthorized" });

            const user = await prisma.users.findUnique({
                where: {
                    user_id: userId
                },
                omit: {
                    password: true,
                },
            });
            if (!user) return res.status(404).send({ message: "User not found" });

            res.status(200).send({ user });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async verifyAccount(req: Request, res: Response) {
        res.status(200).send({ message: "Account verified (dummy)" });
    }

    public async forgetPassword(req: Request, res: Response) {
        res.status(200).send({ message: "Forget password (dummy)" });
    }

    public async resetPassword(req: Request, res: Response) {
        res.status(200).send({ message: "Reset password (dummy)" });
    }
}

export default AuthController;