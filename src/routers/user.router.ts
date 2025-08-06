import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import verifyToken from "../middleware/verifyToken";

class UserRouter {
    private route: Router;
    private userController = new UserController;

    constructor() {
        this.route = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.route.get("/", verifyToken.verifyToken, this.userController.getProfile);
    }

    public getRouter(): Router {
        return this.route;
    }
}

export default UserRouter;