import { Router } from "express";
import AuthController from "../controllers/auth.controller";

class AuthRouter {
    private route: Router;
    private authController: AuthController;

    constructor() {
        this.route = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.post("/signup", this.authController.register);
        this.route.post("/signin", this.authController.loginUser);
        this.route.get("/keeplogin", this.authController.keepLogin);
        this.route.get("/verify", this.authController.verifyAccount);
        this.route.post("/forgetPassword", this.authController.forgetPassword);
        this.route.patch("/resetPassword", this.authController.resetPassword);
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default AuthRouter;